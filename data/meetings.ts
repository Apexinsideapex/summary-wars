import type { Meeting } from "@/types"

// This is sample data - you would replace this with your actual meeting data
export const meetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Product Roadmap Discussion",
    date: "2023-05-15",
    transcript: `
# Product Roadmap Discussion Transcript

**Alex (Product Manager):** Welcome everyone to our product roadmap discussion. Today we'll be focusing on our Q3 and Q4 priorities. Let's start by reviewing what we accomplished in Q2.

**Sarah (Engineering Lead):** In Q2, we completed the user authentication overhaul, launched the new dashboard, and fixed about 85% of the reported bugs from our beta users.

**Alex:** Great, thanks Sarah. Now for Q3, I think we should prioritize the mobile app development since our analytics show increasing mobile usage.

**Michael (UX Designer):** I agree. Our latest user research shows that 60% of our users try to access our platform via mobile devices, and the current responsive design isn't meeting their needs.

**Sarah:** From an engineering perspective, we'd need to allocate at least 3 developers full-time to get a basic version ready by the end of Q3.

**Alex:** That sounds reasonable. Let's put that as our main Q3 goal. For Q4, I'm thinking we should focus on the API integration with popular third-party tools.

**David (Sales):** My team has been getting a lot of requests for Salesforce integration specifically. That should be a priority.

**Sarah:** We can definitely start with Salesforce and then expand to other tools. I'll have my team prepare an estimate for that work.

**Alex:** Perfect. So our roadmap is shaping up to be: Q3 for mobile app development, Q4 for API integrations starting with Salesforce. Any other suggestions or concerns?

**Michael:** We should also allocate some time for design improvements based on the user feedback we've been collecting.

**Alex:** Good point. Let's allocate 20% of our resources in both quarters for continuous improvements and addressing user feedback. If there are no other comments, I'll finalize this roadmap and share it with everyone by the end of the week.
    `,
    notes: `
# Meeting Notes: Product Roadmap

- Q2 Accomplishments:
  - Auth overhaul ✓
  - New dashboard ✓
  - Bug fixes (85%)

- Q3 Priority: Mobile App
  - 60% users on mobile
  - Need 3 devs full-time
  - Basic version by end of Q3

- Q4 Priority: API Integrations
  - Start with Salesforce (high demand)
  - Expand to other tools later

- Continuous Improvements:
  - 20% resources allocated each quarter
  - Focus on user feedback

- Action Items:
  - Alex to finalize roadmap by end of week
  - Sarah to prepare estimates for Salesforce integration
  - Michael to compile design improvement priorities
    `,
    summaryV1: `
# Product Roadmap Meeting Summary

## Key Decisions
- Mobile app development will be the main focus for Q3
- API integrations (starting with Salesforce) will be the priority for Q4
- 20% of resources will be allocated for continuous improvements in both quarters

## Q2 Accomplishments
- Completed user authentication overhaul
- Launched new dashboard
- Fixed 85% of reported bugs from beta users

## Q3 Plans
- Develop mobile app (3 developers needed full-time)
- Address increasing mobile usage (60% of users access via mobile)
- Deliver basic version by end of Q3

## Q4 Plans
- Implement API integration with third-party tools
- Start with Salesforce integration (high demand from sales)
- Expand to other integrations after Salesforce

## Next Steps
- Alex will finalize and share the roadmap by end of week
- Sarah will prepare estimates for Salesforce integration work
- Michael will compile design improvement priorities based on user feedback
    `,
    summaryV2: `
# Product Roadmap Discussion Summary

The product team met to discuss priorities for the upcoming quarters. After reviewing Q2 accomplishments (authentication overhaul, new dashboard, and bug fixes), they decided to focus Q3 efforts on mobile app development due to data showing 60% of users accessing via mobile devices. Engineering estimates this will require 3 full-time developers to complete a basic version by quarter end.

For Q4, the team will prioritize API integrations, beginning with Salesforce based on sales team feedback, followed by other third-party tools. Additionally, 20% of resources will be allocated each quarter for continuous improvements based on user feedback.

Action items include finalizing the roadmap document, preparing technical estimates for the Salesforce integration, and compiling design improvement priorities.
    `,
  },
  {
    id: "meeting-2",
    title: "Marketing Campaign Planning",
    date: "2023-05-20",
    transcript: "This is a placeholder for the meeting transcript...",
    notes: "This is a placeholder for the meeting notes...",
    summaryV1: "This is a placeholder for summary version 1...",
    summaryV2: "This is a placeholder for summary version 2...",
  },
  {
    id: "meeting-3",
    title: "Budget Review",
    date: "2023-05-25",
    transcript: "This is a placeholder for the meeting transcript...",
    notes: "This is a placeholder for the meeting notes...",
    summaryV1: "This is a placeholder for summary version 1...",
    summaryV2: "This is a placeholder for summary version 2...",
  },
  {
    id: "meeting-4",
    title: "Team Retrospective",
    date: "2023-06-01",
    transcript: "This is a placeholder for the meeting transcript...",
    notes: "This is a placeholder for the meeting notes...",
    summaryV1: "This is a placeholder for summary version 1...",
    summaryV2: "This is a placeholder for summary version 2...",
  },
  {
    id: "meeting-5",
    title: "Customer Feedback Session",
    date: "2023-06-05",
    transcript: "This is a placeholder for the meeting transcript...",
    notes: "This is a placeholder for the meeting notes...",
    summaryV1: "This is a placeholder for summary version 1...",
    summaryV2: "This is a placeholder for summary version 2...",
  },
]
