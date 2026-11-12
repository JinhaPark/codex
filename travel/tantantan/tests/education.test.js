import test from 'node:test';
import assert from 'node:assert/strict';
import { educationData as d, annualStudentBudget, tuitionWageMonths, formatEducationWon } from '../src/education-data.js';
import { renderEducation } from '../src/render-education.js';
import education from '../src/central-asia-education.js';

test('student budgets include one tuition and twelve months, utilities only for independent housing',()=>{
 assert.deepEqual(annualStudentBudget('dorm'),[224400,291000]);
 assert.deepEqual(annualStudentBudget('rent'),[537000,747000]);
 assert.throws(()=>annualStudentBudget('unknown'),RangeError);
 assert.equal(tuitionWageMonths(d.wage.monthlyKgs),1);
});
test('tuition is calculated from source currency and renders only KRW',()=>{
 assert.equal(formatEducationWon(75000),'114');
 const html=renderEducation();
 assert.match(html,/data-core-section="education"/);
 assert.match(html,/114/);
 assert.doesNotMatch(html,/75000|75,000|120000|сом|KGS/);
 assert.match(html,/기준연도 미표시/);
 assert.match(html,/학생 조사 아님/);
 assert.equal(education.chapters.length,3);
 assert.equal(new Set(d.tuition.map(x=>x.school)).size,3);
});
