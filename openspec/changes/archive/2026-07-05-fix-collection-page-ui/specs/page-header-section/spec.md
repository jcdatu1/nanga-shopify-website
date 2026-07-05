## ADDED Requirements

### Requirement: Contextual title and subtitle fallback

When the section's `title` setting is blank, the header SHALL fall back to the template context's title: `collection.title` on collection templates, else `page.title` on page templates. When the subtitle setting is blank on a collection template, the header SHALL fall back to `collection.description` (rendered as rich text). Instances with non-blank settings SHALL behave exactly as before; a blank fallback (e.g. a collection with no description) SHALL render cleanly with no empty-element artifacts.

#### Scenario: Dynamic collection header

- **WHEN** an instance with a blank title and blank subtitle renders on a collection template
- **THEN** the header shows the current collection's title as the heading and its description as the subtitle

#### Scenario: Static settings take precedence

- **WHEN** an instance sets a non-blank title (e.g. "KNOWLEDGE")
- **THEN** the configured text renders and no contextual fallback applies

#### Scenario: Collection without a description

- **WHEN** the current collection has no description and the subtitle setting is blank
- **THEN** the header renders only the title, with no empty subtitle markup
