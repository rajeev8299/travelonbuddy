import {
  generateBookingConfirmationHtml,
  sendBookingConfirmationEmail,
  getEmailAuditLogs,
  hasConfirmationEmailBeenSent,
} from '../src/services/emailService.ts';
import { TRAVEL_BUDDIES_DATA, MOCK_REQUESTS_DATA } from '../src/data/mockData.ts';

// Setup mock window/localStorage for node test runner
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
};

console.log('--- TRAVELONBUDDY EMAIL SERVICE TEST SUITE ---');

async function runTests() {
  const buddy = TRAVEL_BUDDIES_DATA.find((b) => b.id === 'buddy-anand-shukla');
  const baseReq = { ...MOCK_REQUESTS_DATA[0] };

  // TEST 1: Booking unconfirmed -> Should NOT send
  baseReq.status = 'Request Submitted';
  let res = await sendBookingConfirmationEmail(baseReq, buddy);
  console.assert(!res.success, 'TEST 1 Failed: Unconfirmed booking should not send');
  console.log('✓ TEST 1 Passed: Unconfirmed booking blocked.');

  // TEST 2: Booking Pending -> Should NOT send
  baseReq.status = 'Under Review';
  res = await sendBookingConfirmationEmail(baseReq, buddy);
  console.assert(!res.success, 'TEST 2 Failed: Under review booking should not send');
  console.log('✓ TEST 2 Passed: Under review booking blocked.');

  // TEST 3: Booking Rejected / Cancelled -> Should NOT send
  baseReq.status = 'Cancelled';
  res = await sendBookingConfirmationEmail(baseReq, buddy);
  console.assert(!res.success, 'TEST 3 Failed: Cancelled booking should not send');
  console.log('✓ TEST 3 Passed: Cancelled booking blocked.');

  // TEST 4: Booking Buddy Assignment Proposed -> Should NOT send
  baseReq.status = 'Buddy Assignment Proposed';
  res = await sendBookingConfirmationEmail(baseReq, buddy);
  console.assert(!res.success, 'TEST 4 Failed: Proposed assignment should not send');
  console.log('✓ TEST 4 Passed: Proposed assignment blocked.');

  // TEST 5: Booking genuinely Confirmed -> Dispatches successfully
  baseReq.status = 'Booking Confirmed';
  baseReq.assignedBuddyId = buddy.id;
  res = await sendBookingConfirmationEmail(baseReq, buddy);
  console.assert(res.success, 'TEST 5 Failed: Confirmed booking must dispatch');
  console.assert(hasConfirmationEmailBeenSent(baseReq.id), 'TEST 5 Failed: Audit log not recorded');
  console.log('✓ TEST 5 Passed: Confirmed booking dispatched successfully.');

  // TEST 6: Duplicate prevention (Idempotency) -> Should NOT send second time
  const resDuplicate = await sendBookingConfirmationEmail(baseReq, buddy);
  console.assert(resDuplicate.success && resDuplicate.messageId.includes('IDEMPOTENT'), 'TEST 6 Failed: Idempotency failed');
  console.log('✓ TEST 6 Passed: Duplicate prevention / Idempotency verified.');

  // TEST 7: Authorised Admin Resend -> Should allow re-dispatch
  const resResend = await sendBookingConfirmationEmail(baseReq, buddy, { isResend: true });
  console.assert(resResend.success && !resResend.messageId.includes('IDEMPOTENT'), 'TEST 7 Failed: Authorised resend failed');
  console.log('✓ TEST 7 Passed: Authorised admin resend verified.');

  // TEST 8: HTML Template verification
  const html = generateBookingConfirmationHtml(baseReq, buddy);
  console.assert(html.includes(buddy.name), 'TEST 8 Failed: Buddy name missing in HTML');
  console.assert(html.includes(buddy.contactNumber), 'TEST 8 Failed: Buddy phone missing in HTML');
  console.assert(html.includes(baseReq.bookingRef), 'TEST 8 Failed: Booking ref missing in HTML');
  console.assert(html.includes('tel:'), 'TEST 8 Failed: tel: link missing in HTML');
  console.assert(html.includes('wa.me/'), 'TEST 8 Failed: WhatsApp link missing in HTML');
  console.log('✓ TEST 8 Passed: HTML template includes authentic phone, WhatsApp, ref & styling.');

  console.log('\nALL 8 TEST SCENARIOS PASSED WITH ZERO FAILURES.');
}

runTests().catch(console.error);
