/**
 * Utility functions for the Team Approval Checker GitHub Action.
 *
 * These functions help determine if reviewers are part of a specific team,
 * count the number of valid approvals from team members, and check if the
 * required number of approvals has been met.
 */

/**
 * Checks if a given reviewer is a member of the specified team.
 *
 * @param {string} reviewer - The GitHub username of the reviewer.
 * @param {string[]} teamMembers - Array of GitHub usernames who are members of the team.
 * @returns {boolean} True if the reviewer is in the team, false otherwise.
 */
function isReviewerInTeam(reviewer, teamMembers) {
    return teamMembers.includes(reviewer);
}

/**
 * Counts the number of approvals on a pull request from team members.
 *
 * @param {Object[]} reviews - Array of review objects from the GitHub API.
 * @param {string[]} teamMembers - Array of GitHub usernames who are members of the team.
 * @returns {number} The count of unique team member approvals.
 */
function countApprovals(reviews, teamMembers) {
    return reviews.filter(review => 
        review.state === 'APPROVED' && 
        isReviewerInTeam(review.user.login, teamMembers)
    ).length;
}

/**
 * Checks if the actual number of approvals meets or exceeds the required number.
 *
 * @param {number} requiredApprovals - The minimum number of approvals required.
 * @param {number} actualApprovals - The actual number of approvals received.
 * @returns {boolean} True if the requirement is met, false otherwise.
 */
function checkApprovalStatus(requiredApprovals, actualApprovals) {
    return actualApprovals >= requiredApprovals;
}

module.exports = {
    isReviewerInTeam,
    countApprovals,
    checkApprovalStatus
};