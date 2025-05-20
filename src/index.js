/**
 * GitHub Action: Team Approval Checker
 *
 * This action checks if a pull request (PR) has received a required number of approvals
 * from members of a specific GitHub team. It is intended to be triggered by a PR review event.
 * The action uses the GitHub API to fetch PR reviews and team members, then counts the number
 * of unique team members who have approved the PR. If the required number of approvals is met,
 * the action logs success; otherwise, it logs failure.
 *
 * Environment Variables:
 * - GITHUB_TOKEN: GitHub token for authentication (provided by GitHub Actions).
 * - TEAM_NAME: The name of the GitHub team whose approvals are required.
 * - REQUIRED_APPROVALS: The minimum number of team member approvals required.
 */
const core = require('@actions/core');
const { getPullRequestReviews, getTeamMembers, checkApprovals } = require('./utils');

async function run() {
    // Import GitHub Actions context and Octokit client
    const context = require('@actions/github').context;
    const token = core.getInput('token', { required: true });
    const github = require('@actions/github').getOctokit(token);

    // Extract the pull request object from the event payload
    const { pull_request } = context.payload;

    // Exit if no pull request is found in the event payload
    if (!pull_request) {
        console.log('No pull request found.');
        return;
    }

    // Read team name and required approvals from environment variables
    const teamName = core.getInput('team_name', { required: true });
    const requiredApprovals = parseInt(core.getInput('required_approvals', { required: true }), 10);
    
    // Fetch all reviews for the pull request
    const reviews = await getPullRequestReviews(github, context, pull_request.number);

    // Fetch all members of the specified team
    const teamMembers = await getTeamMembers(github, context, teamName);

    // Count the number of unique team members who have approved the PR
    const approvalCount = checkApprovals(reviews, teamMembers);

    // Log result and update PR status accordingly
    if (approvalCount >= requiredApprovals) {
        console.log(`Success: ${approvalCount} approvals from team ${teamName} met the requirement.`);
        // Note: The following API call does not set a check status; it attempts to update the PR state.
        // For proper check status, use the Checks API or set an output for a composite action.
        await github.rest.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pull_request.number,
            state: 'success'
        });
    } else {
        console.log(`Failed: Only ${approvalCount} approvals from team ${teamName} received.`);
        await github.rest.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pull_request.number,
            state: 'failure'
        });
    }
}

// Run the action and handle any uncaught errors
run().catch(error => {
    console.error(error);
    process.exit(1);
});