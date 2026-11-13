# ChatGPT Discovery Handoff Guide

## 1. Why a Manual Copy-Paste Protocol?

Rather than attempting brittle headless browser scrapers, requesting sensitive OpenAI API credentials from users, or violating OpenAI session terms of service, FOYC implements an intentional, transparent **Human-in-the-Loop Copy-Paste Protocol**.

### Core Benefits:
- **Zero Credential Sharing:** The user never provides their OpenAI password, session cookie, or API key to FOYC.
- **Privacy Assurance:** The user sees every prompt sent to ChatGPT and reviews every piece of output before importing it into FOYC.
- **Model Flexibility:** Works seamlessly with ChatGPT Plus (GPT-4o), free tier (GPT-4o mini), Claude, or any LLM interface.

---

## 2. The 8-Stage Step-by-Step Flow

```
[1. FOYC Landing] -> [2. 3-Question Onboarding] -> [3. What's On Your Mind Reflection]
                                                           │
                                                           ▼
[6. Delimited JSON Payload] ◄- [5. ChatGPT Deep Interview] ◄- [4. Coach System Prompt Generated]
          │
          ▼
[7. FOYC Import & Validation Preview] -> [8. Personalized Career Command Centre]
```

### Stage 1: Initial Discovery
The user visits `http://127.0.0.1:5173/` and experiences the interactive career simulator and benefits overview.

### Stage 2: Quick Onboarding
User selects current situation (Student, Career Switcher, Professional, Self-Taught, or Founder), weekly time availability, and baseline confidence.

### Stage 3: Reflection ("What's On Your Mind")
The user writes or dictates their real doubts, ambitions, and frustrations. Quick prompt starters help overcome blank-page anxiety.

### Stage 4: Coach System Prompt Generation
FOYC crafts a customized system prompt that instructs ChatGPT to act as a senior discovery partner and pragmatic coach. The user copies it with a single click.

### Stage 5: External ChatGPT Interview
The user opens their own ChatGPT tab, pastes the prompt, and engages in a 5–15 minute conversation to clarify their direction, uncover strengths, and address blind spots.

### Stage 6: Generating the Delimited JSON Block
When satisfied with their direction, the user types:
> *"I'm ready for my FOYC career plan. Please generate the handoff block now."*

ChatGPT outputs the plan enclosed in clear boundaries:
```
FOYC_HANDOFF_START
{
  "schemaVersion": "foyc_handoff_v1",
  ...
}
FOYC_HANDOFF_END
```

### Stage 7: Import & Preview
The user pastes the response into `/import`. FOYC validates the JSON, checks schema compliance, and presents a visual preview with editable fields.

### Stage 8: Living Dashboard
Once approved, the plan instantly populates the 9 command centre modules with milestones, tasks, habit streaks, capstone projects, and weekly reviews.
