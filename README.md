# GitHub Action Team Approval

This GitHub Action checks if a specified number of reviewers from a designated team have approved a pull request. It triggers on pull request review events and utilizes GitHub checks to declare the action as "success" or "failed" based on the conditions.

## Features

- Triggers on pull request reviews.
- Checks if reviewers are part of a specified team.
- Verifies if the required number of approvals from that team has been met.
- Declares the action as "success" or "failed" based on the approval conditions.

## Usage

1. **Setup the Action**: Create a workflow file in your repository under `.github/workflows/team-approval.yml`.

2. **Configure the Action**: Use the following example to configure the action in your workflow:

   ```yaml
   name: Team Approval Check

   on:
     pull_request_review:
       types: [submitted]
       
   permissions:
     contents: read
     pull-requests: read
     issues: read
   
   jobs:
     approval-check:
       runs-on: ubuntu-latest
       steps:
         - name: Check Team Approvals
           uses: jefeish/github-action-team-approval@main
           with:
             team_name: a-team
             required_approvals: 1
             token: ${{ secrets.GH_ADMIN_SECRET }}

   ```

3. **Inputs**:
   - `team-name`: The name of the team whose approvals are required.
   - `required-approvals`: The minimum number of approvals needed from the specified team.

## Requirements

- Ensure that the GitHub Action has the necessary permissions to read pull request reviews and team memberships.
- The action should be placed in a repository that has the specified team configured in GitHub.

## Approval Specs

```mermaid
graph LR
    Repo[Repository] --> PR[Pull Request]
    
    subgraph "Approval Process"
        PR --> A[Review Required]
        A --> B{Approvals}
        
        subgraph "Required Approvers"
            TeamB[TEAM-B<br>forge-xxx-Approver] -->|Min 2 approvals| B
            TeamA[TEAM-A<br>forge-xxx-Developer] -->|Optional| B
        end
        
        B -->|Total: 3 approvals met| C[Approval Complete]
    end
    
    C --> Merge[Merge to Protected Branch]
    
    style PR fill: #f9f,stroke:#333,stroke-width:2px
    style TeamA fill: #FF9933,stroke:#333,stroke-width:1px
    style TeamB color: #fff, fill:#d55,stroke:#333,stroke-width:1px
    style B fill:#ff9,stroke:#333,stroke-width:2px
    style Merge fill:#9f9,stroke:#333,stroke-width:2px
```

## Action Sequence Diagram

```mermaid
sequenceDiagram
    participant Workflow
    participant Action
    participant GitHubAPI

    Workflow->>Action: Trigger on pull_request_review
    Action->>Action: Read inputs (token, team_name, required_approvals)
    Action->>GitHubAPI: Fetch PR reviews (listReviews)
    GitHubAPI-->>Action: Return PR reviews
    Action->>GitHubAPI: Fetch team members (listMembersInOrg)
    GitHubAPI-->>Action: Return team member list
    Action->>Action: Count unique team member approvals
    alt Enough approvals
        Action->>Workflow: Log success, set PR status (success)
    else Not enough approvals
        Action->>Workflow: Log failure, set PR status (failure)
    end
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
