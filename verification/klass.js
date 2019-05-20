'use strict';

/**
 * Determines if the semester on the request body is valid with respect to what's on the class
 * @param {string[]} kSemestersOffered - semesters offered as defined on class
 * @param {string} rBodySemester - semester defined on request body
 * @returns a boolean that is true when the semester on the request body is validated
 */
function checkSemester(kSemestersOffered, rBodySemester) {
    return (!kSemestersOffered.includes(rBodySemester)) ? false : true;
}

/**
 * Checks that the client has sent a valid year (must be a number and has to be between 1900 and 2050)
 * @param {number} rBodyYear - a year as defined on request body
 * @returns a boolean that is true if the year is valid
 */
function checkYear(rBodyYear) {
    return (rBodyYear < 1900 || rBodyYear > 2050) ? false : (typeof rBodyYear !== 'number') ? false : true;
}

module.exports = {
    checkSemester,
    checkYear
};