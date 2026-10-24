// Shared, framework-free travel page helpers.
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const mapSearchUrl = place => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place);
export const formatTravelDate = value => new Date(value + 'T12:00:00Z').toLocaleDateString('ko-KR', {month:'short', day:'numeric', weekday:'short', timeZone:'UTC'});
