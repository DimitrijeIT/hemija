# Chemistry Educational Game - Requirements Specification

**Project Name:** HemiLab (working title)
**Platform:** Web (PWA), Android, iOS
**Target Audience:** Serbian students, grades 7-8 (ages 12-14)
**Language:** Serbian (Latin script primary, Cyrillic optional)

---

## 1. Product Vision

### 1.1 Purpose
An interactive, gamified chemistry learning app that helps Serbian students master chemistry concepts through hands-on virtual experiments, molecule building, and engaging challenges aligned with the national curriculum.

### 1.2 Core Value Proposition
- Learn chemistry through play, not memorization
- Serbian language with curriculum alignment
- Works offline on any device
- Progress tracking for students and parents

### 1.3 Success Metrics
| Metric | Target (Year 1) |
|--------|-----------------|
| Downloads/Installs | 10,000+ |
| Daily Active Users | 1,000+ |
| Session Duration | 8+ minutes |
| Retention (Day 7) | 30%+ |
| Premium Conversion | 5%+ |

---

## 2. User Personas

### 2.1 Primary: Student (Marko, 13)
- 7th grade student in Belgrade
- Has smartphone, uses it daily
- Struggles with chemistry, finds it boring
- Loves mobile games
- **Goal:** Pass chemistry test, have fun learning

### 2.2 Secondary: Parent (Jelena, 42)
- Mother of two school-age children
- Concerned about screen time
- Willing to pay for educational content
- **Goal:** Help child succeed in school

### 2.3 Tertiary: Teacher (Dragan, 38)
- Chemistry teacher at public school
- Uses Kahoot occasionally
- Limited tech budget
- **Goal:** Engage students, supplement lessons

---

## 3. Functional Requirements

### 3.1 Core Game Mechanics

#### 3.1.1 Molecule Builder (Primary Mechanic)
| ID | Requirement | Priority |
|----|-------------|----------|
| MB-01 | User can drag elements from element tray to workspace | Must Have |
| MB-02 | Elements snap together when compatible bonds exist | Must Have |
| MB-03 | Visual feedback when correct molecule is formed | Must Have |
| MB-04 | Visual feedback when incorrect combination attempted | Must Have |
| MB-05 | Molecule rotates/animates when completed | Should Have |
| MB-06 | Show molecule name and formula on completion | Must Have |
| MB-07 | Display fun fact about completed molecule | Should Have |
| MB-08 | Hint system (costs coins or shows after X attempts) | Must Have |
| MB-09 | Undo last action button | Should Have |
| MB-10 | Clear workspace button | Must Have |

#### 3.1.2 Element Laboratory
| ID | Requirement | Priority |
|----|-------------|----------|
| EL-01 | Interactive periodic table view | Must Have |
| EL-02 | Tap element to see details (name, symbol, atomic number) | Must Have |
| EL-03 | Element categories color-coded | Must Have |
| EL-04 | Lock/unlock elements based on progress | Must Have |
| EL-05 | Search/filter elements by name or symbol | Could Have |
| EL-06 | 3D atom visualization (electrons, protons, neutrons) | Could Have |
| EL-07 | Audio pronunciation of element names | Could Have |

#### 3.1.3 Challenge Mode
| ID | Requirement | Priority |
|----|-------------|----------|
| CM-01 | Timed challenges to build specific molecules | Should Have |
| CM-02 | Increasing difficulty levels | Must Have |
| CM-03 | Star rating system (1-3 stars based on performance) | Must Have |
| CM-04 | Daily challenge with bonus rewards | Should Have |
| CM-05 | Challenge history and best scores | Should Have |

#### 3.1.4 Quiz Mode
| ID | Requirement | Priority |
|----|-------------|----------|
| QZ-01 | Multiple choice questions about elements/molecules | Should Have |
| QZ-02 | Match element to symbol | Should Have |
| QZ-03 | Identify molecule from image | Should Have |
| QZ-04 | Fill in missing element in formula | Should Have |
| QZ-05 | Timed quiz rounds | Could Have |

### 3.2 Progression System

#### 3.2.1 Chapters & Levels
| ID | Requirement | Priority |
|----|-------------|----------|
| PG-01 | Content organized into chapters (topics) | Must Have |
| PG-02 | Each chapter contains 5-10 levels | Must Have |
| PG-03 | Levels unlock sequentially within chapter | Must Have |
| PG-04 | Chapters unlock based on previous chapter completion | Must Have |
| PG-05 | Visual map showing progress through chapters | Should Have |
| PG-06 | Chapter completion rewards | Should Have |

#### 3.2.2 Rewards & Currency
| ID | Requirement | Priority |
|----|-------------|----------|
| RW-01 | Earn coins for completing levels | Must Have |
| RW-02 | Earn stars based on performance (1-3 per level) | Must Have |
| RW-03 | Coins can unlock hints | Should Have |
| RW-04 | Coins can unlock cosmetic items (lab coats, backgrounds) | Could Have |
| RW-05 | Achievement badges for milestones | Should Have |
| RW-06 | XP/Level system for overall progress | Could Have |

#### 3.2.3 Progress Tracking
| ID | Requirement | Priority |
|----|-------------|----------|
| PT-01 | Save progress locally on device | Must Have |
| PT-02 | Display total stars collected | Must Have |
| PT-03 | Display molecules discovered count | Must Have |
| PT-04 | Display elements unlocked count | Must Have |
| PT-05 | Cloud save with account (optional) | Could Have |
| PT-06 | Parent dashboard to view child progress | Could Have |

### 3.3 User Interface

#### 3.3.1 Main Menu
| ID | Requirement | Priority |
|----|-------------|----------|
| UI-01 | Play/Continue button (prominent) | Must Have |
| UI-02 | Chapter select access | Must Have |
| UI-03 | Settings button | Must Have |
| UI-04 | Profile/Progress button | Must Have |
| UI-05 | Shop/Premium button | Should Have |
| UI-06 | Daily reward indicator | Should Have |

#### 3.3.2 Game Screen
| ID | Requirement | Priority |
|----|-------------|----------|
| GS-01 | Element tray at bottom (scrollable if needed) | Must Have |
| GS-02 | Workspace area in center | Must Have |
| GS-03 | Current objective display | Must Have |
| GS-04 | Hint button | Must Have |
| GS-05 | Pause/Menu button | Must Have |
| GS-06 | Progress indicator (e.g., 3/5 molecules) | Must Have |
| GS-07 | Timer display (for timed challenges) | Should Have |
| GS-08 | Coin/Star count | Should Have |

#### 3.3.3 Level Complete Screen
| ID | Requirement | Priority |
|----|-------------|----------|
| LC-01 | Star rating display (animated) | Must Have |
| LC-02 | Points/Coins earned | Must Have |
| LC-03 | Molecule fun fact | Should Have |
| LC-04 | Next level button | Must Have |
| LC-05 | Replay level button | Must Have |
| LC-06 | Share achievement button | Could Have |

### 3.4 Settings & Preferences

| ID | Requirement | Priority |
|----|-------------|----------|
| ST-01 | Sound effects on/off | Must Have |
| ST-02 | Music on/off | Must Have |
| ST-03 | Language toggle (Latin/Cyrillic) | Should Have |
| ST-04 | Reset progress option (with confirmation) | Must Have |
| ST-05 | Notifications on/off | Should Have |
| ST-06 | Privacy policy link | Must Have |
| ST-07 | Contact/Support link | Must Have |
| ST-08 | Rate app prompt | Should Have |

---

## 4. Content Requirements

### 4.1 Elements Database

#### 4.1.1 Element Data Structure
Each element record must contain:
```
- id (symbol): String, unique identifier
- name_sr_lat: String, Serbian name (Latin)
- name_sr_cyr: String, Serbian name (Cyrillic)
- name_en: String, English name
- atomic_number: Integer
- atomic_mass: Float
- category: Enum (nonmetal, alkali_metal, alkaline_earth, 
  transition_metal, metalloid, halogen, noble_gas, etc.)
- color: Hex color code for visual
- icon_path: String, path to sprite
- electron_config: String (e.g., "2-8-1")
- fun_fact: String, interesting fact in Serbian
- unlock_level: Integer, when element becomes available
- is_premium: Boolean
```

#### 4.1.2 Required Elements (MVP - 20 elements)
| Priority | Elements |
|----------|----------|
| Chapter 1 | H, O, C, N |
| Chapter 2 | Na, Cl, K, Ca |
| Chapter 3 | S, P, Mg, Fe |
| Chapter 4 | Cu, Zn, Al, Si |
| Chapter 5 | Br, I, F, He |

#### 4.1.3 Extended Elements (Post-MVP - 40 additional)
All remaining elements up to atomic number 36 (Krypton), plus select heavier elements relevant to curriculum.

### 4.2 Formulas/Molecules Database

#### 4.2.1 Formula Data Structure
```
- id: String, unique identifier
- formula: String, chemical formula (e.g., "H2O")
- name_sr: String, Serbian name
- name_en: String, English name
- ingredients: Array of {element_id, count}
- category: Enum (oxide, acid, base, salt, organic, etc.)
- chapter: Integer, which chapter this belongs to
- level: Integer, which level within chapter
- difficulty: Integer (1-5)
- points: Integer, base points for completion
- hint_text: String, hint in Serbian
- fun_fact: String, interesting fact
- real_world_use: String, where this is found/used
- animation_type: Enum (bubble, crystal, gas, liquid, glow)
- molecule_image: String, path to completed molecule sprite
- is_premium: Boolean
```

#### 4.2.2 Required Molecules (MVP - 30 molecules)

**Chapter 1: Osnove hemije (Basics)**
| Formula | Name | Difficulty |
|---------|------|------------|
| H2 | Vodonik (molekul) | 1 |
| O2 | Kiseonik (molekul) | 1 |
| H2O | Voda | 1 |
| CO2 | Ugljen-dioksid | 2 |
| NH3 | Amonijak | 2 |
| CH4 | Metan | 2 |

**Chapter 2: Oksidi i hidroksidi**
| Formula | Name | Difficulty |
|---------|------|------------|
| Na2O | Natrijum-oksid | 2 |
| CaO | Kalcijum-oksid | 2 |
| MgO | Magnezijum-oksid | 2 |
| NaOH | Natrijum-hidroksid | 3 |
| Ca(OH)2 | Kalcijum-hidroksid | 3 |
| KOH | Kalijum-hidroksid | 3 |

**Chapter 3: Kiseline**
| Formula | Name | Difficulty |
|---------|------|------------|
| HCl | Hlorovodonična kiselina | 2 |
| H2SO4 | Sumporna kiselina | 3 |
| HNO3 | Azotna kiselina | 3 |
| H3PO4 | Fosforna kiselina | 4 |
| H2CO3 | Ugljena kiselina | 3 |

**Chapter 4: Soli**
| Formula | Name | Difficulty |
|---------|------|------------|
| NaCl | Natrijum-hlorid (so) | 2 |
| KCl | Kalijum-hlorid | 2 |
| CaCO3 | Kalcijum-karbonat | 3 |
| NaHCO3 | Natrijum-hidrogenkarbonat | 3 |
| CaSO4 | Kalcijum-sulfat (gips) | 3 |
| FeCl3 | Gvožđe(III)-hlorid | 4 |

**Chapter 5: Organska jedinjenja (Intro)**
| Formula | Name | Difficulty |
|---------|------|------------|
| C2H6 | Etan | 3 |
| C2H4 | Eten (etilen) | 3 |
| C2H2 | Etin (acetilen) | 3 |
| CH3OH | Metanol | 4 |
| C2H5OH | Etanol | 4 |
| C6H12O6 | Glukoza | 5 |

### 4.3 Chapter Structure

#### 4.3.1 Chapter Data Structure
```
- id: Integer, unique identifier
- name_sr: String, chapter name in Serbian
- description: String, chapter description
- icon: String, path to chapter icon
- background: String, path to lab background
- elements_unlocked: Array of element IDs
- levels: Array of level objects
- unlock_requirement: Object {chapter_id, stars_required}
- is_premium: Boolean
- curriculum_topic: String, maps to Serbian curriculum
```

#### 4.3.2 Chapter Outline (MVP)
| # | Name | Levels | Elements | Curriculum Topic |
|---|------|--------|----------|------------------|
| 1 | Uvod u hemiju | 8 | H, O, C, N | Atomi i molekuli |
| 2 | Oksidi | 6 | +Na, Ca, Mg, K | Oksidi metala i nemetala |
| 3 | Kiseline i baze | 8 | +Cl, S, P | Kiseline, baze, pH |
| 4 | Soli | 6 | +Fe, Cu, Zn | Neutralizacija, soli |
| 5 | Organska hemija | 6 | +Al, Si | Ugljovodonici |
| **Total** | | **34** | **20** | |

### 4.4 Localization Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| L-01 | All UI text in Serbian | Must Have |
| L-02 | Support Latin script (primary) | Must Have |
| L-03 | Support Cyrillic script (toggle) | Should Have |
| L-04 | Element names match official Serbian nomenclature | Must Have |
| L-05 | Formulas use IUPAC standard notation | Must Have |
| L-06 | Fun facts culturally relevant to Serbia | Should Have |

---

## 5. Technical Requirements

### 5.1 Platform Support

| Platform | Version | Priority |
|----------|---------|----------|
| Web (Chrome) | Latest | Must Have |
| Web (Safari) | Latest | Must Have |
| Web (Firefox) | Latest | Should Have |
| Android | 8.0+ (API 26) | Must Have |
| iOS | 13.0+ | Should Have |
| PWA | Installable | Must Have |

### 5.2 Performance Requirements

| Metric | Target |
|--------|--------|
| Initial load time | < 5 seconds (3G) |
| Level load time | < 2 seconds |
| Frame rate | 60 FPS (30 FPS minimum) |
| Memory usage | < 200 MB |
| App size | < 50 MB (initial), < 100 MB (with all assets) |
| Offline support | Full gameplay without internet |

### 5.3 Data Architecture

#### 5.3.1 Local Storage
| Data Type | Storage Method | Size Limit |
|-----------|----------------|------------|
| User progress | LocalStorage / IndexedDB | 5 MB |
| Settings | LocalStorage | 100 KB |
| Cached assets | Service Worker Cache | 100 MB |

#### 5.3.2 External Data
| Data Type | Source | Update Frequency |
|-----------|--------|------------------|
| Elements | JSON file (bundled) | Per app update |
| Formulas | JSON file (bundled) | Per app update |
| Chapters | JSON file (bundled) | Per app update |
| Daily challenges | Remote API (optional) | Daily |

### 5.4 Audio Requirements

| Type | Format | Specs |
|------|--------|-------|
| Background music | MP3/OGG | 128 kbps, loop-friendly |
| Sound effects | MP3/OGG | < 100 KB each |
| Voice (optional) | MP3 | Clear Serbian pronunciation |

**Required Sound Effects:**
- Element select (pick up)
- Element place (snap)
- Correct combination (success)
- Wrong combination (error)
- Level complete (fanfare)
- Star earned (ding)
- Coin earned (coin sound)
- Button tap
- Hint reveal

### 5.5 Visual Requirements

| Asset Type | Format | Resolution |
|------------|--------|------------|
| UI elements | PNG (with alpha) | @1x, @2x, @3x |
| Element sprites | PNG | 128x128 base |
| Backgrounds | PNG/JPG | 1920x1080 |
| Animations | Sprite sheets | 30 FPS |
| Icons | SVG or PNG | 512x512 (app icon) |

---

## 6. Monetization Requirements

### 6.1 Free Tier
| Feature | Included |
|---------|----------|
| Chapters 1-2 | Full access |
| Chapter 3+ | First level only |
| Elements | 12 basic elements |
| Hints | 3 free per day |
| Ads | Banner ads, interstitial between levels |

### 6.2 Premium Tier (€4.99/month or €29.99/year)
| Feature | Included |
|---------|----------|
| All chapters | Full access |
| All elements | 60+ elements |
| Hints | Unlimited |
| Ads | None |
| Bonus content | Extra challenges, cosmetics |
| Cloud sync | Save across devices |

### 6.3 In-App Purchases (Optional)
| Item | Price |
|------|-------|
| Hint pack (10 hints) | €0.99 |
| Single chapter unlock | €1.99 |
| Remove ads (lifetime) | €4.99 |

---

## 7. Analytics & Tracking

### 7.1 Events to Track
| Event | Parameters |
|-------|------------|
| app_open | session_id, platform |
| level_start | chapter_id, level_id |
| level_complete | chapter_id, level_id, stars, time_spent |
| level_fail | chapter_id, level_id, attempt_count |
| hint_used | chapter_id, level_id |
| element_unlocked | element_id |
| purchase | product_id, price |
| ad_shown | ad_type, placement |

### 7.2 COPPA Compliance (CRITICAL)

**COPPA applies because:** Target users are under 13, or app is directed at children.

#### 7.2.1 Data Collection Restrictions
| Data Type | Collection Allowed | Notes |
|-----------|-------------------|-------|
| Gameplay progress | ✅ Local only | No cloud without parental consent |
| Device type/OS | ✅ Anonymous | For debugging, not linked to user |
| Aggregate analytics | ✅ Anonymous | Event counts only, no user IDs |
| Email address | ❌ Prohibited | Unless verifiable parental consent |
| Real name | ❌ Prohibited | Use auto-generated usernames only |
| Photos/camera | ❌ Prohibited | Not in app |
| Voice/audio | ❌ Prohibited | Not in app |
| Precise location | ❌ Prohibited | Not needed |
| Advertising ID | ❌ Prohibited | No behavioral tracking |
| Persistent identifiers | ❌ Prohibited | No cross-app tracking |

#### 7.2.2 Required Implementations
| ID | Requirement | Priority |
|----|-------------|----------|
| CP-01 | Age gate on first launch | Must Have |
| CP-02 | COPPA-mode for users under 13 | Must Have |
| CP-03 | Parental gate for purchases | Must Have |
| CP-04 | Parental gate for external links | Must Have |
| CP-05 | Kid-safe ad networks only (AdMob Families) | Must Have |
| CP-06 | No behavioral/targeted advertising | Must Have |
| CP-07 | Privacy policy accessible in-app | Must Have |
| CP-08 | Privacy policy link in app stores | Must Have |
| CP-09 | Data deletion mechanism | Must Have |
| CP-10 | Verifiable parental consent for cloud saves | Should Have |

#### 7.2.3 Age Gate Flow
```
First Launch:
  → "Koliko imaš godina?" (How old are you?)
  → Option A: "Imam manje od 13" (Under 13)
      → Enable COPPA mode
      → Local saves only
      → Kid-safe ads only
      → No social features
  → Option B: "Imam 13 ili više" (13 or older)
      → Standard mode
      → All features available
```

#### 7.2.4 Parental Gate Implementation
```
Before purchases or external links:
  → Math challenge: "Koliko je 17 + 28?" 
  → Correct answer required to proceed
  → Wrong answer: "Zamoli roditelja za pomoć"
```

#### 7.2.5 Advertising Compliance
| Ad Type | Allowed | Network |
|---------|---------|---------|
| Contextual banner | ✅ Yes | AdMob for Families |
| Contextual interstitial | ✅ Yes | AdMob for Families |
| Rewarded video | ⚠️ Careful | Must not be manipulative |
| Behavioral/targeted | ❌ No | Prohibited |
| Personalized | ❌ No | Prohibited |

#### 7.2.6 App Store Compliance
**Google Play - Families Policy:**
- Enroll in "Designed for Families" program
- Declare target age: 9-12
- Use only approved ad SDKs
- Teacher Approved badge (optional, requires review)

**Apple App Store - Kids Category:**
- Select "Kids" category, age range 9-11
- No external links without parental gate
- No third-party analytics without disclosure
- Parental gate for any purchases

#### 7.2.7 Privacy Policy Requirements
Must include and be written in clear Serbian:
- What data is collected (minimal)
- How data is used
- Third parties (ad networks)
- Parental rights (access, delete, refuse)
- Contact information
- Data security practices
- Data retention (delete when not needed)
- How to request data deletion

### 7.3 GDPR Compliance (EU Users)
| Requirement | Implementation |
|-------------|----------------|
| Consent for analytics | Opt-in dialog |
| Right to deletion | Settings → Delete my data |
| Data portability | Export progress as JSON |
| Privacy by design | Minimal data collection |
| Age of consent | 16 in most EU countries (use parental consent for under 16)

---

## 8. Testing Requirements

### 8.1 Device Testing Matrix
| Device Type | Examples |
|-------------|----------|
| Low-end Android | Samsung A12, Xiaomi Redmi 9 |
| Mid-range Android | Samsung A52, Xiaomi Note 11 |
| High-end Android | Samsung S23, Pixel 7 |
| iPhone | iPhone SE, iPhone 12, iPhone 14 |
| Tablet | iPad, Samsung Tab |
| Desktop | Chrome, Safari, Firefox |

### 8.2 Test Scenarios
- [ ] All 34 levels completable
- [ ] All molecules form correctly
- [ ] Progress saves and restores
- [ ] Offline mode works
- [ ] Sound toggles work
- [ ] Touch controls responsive
- [ ] No memory leaks after 30+ minutes
- [ ] IAP flow completes successfully

---

## 9. Launch Requirements

### 9.1 MVP Checklist
- [ ] 2 chapters fully playable (14 levels)
- [ ] 12 elements available
- [ ] 15 molecules to discover
- [ ] Core loop complete (play → earn → unlock)
- [ ] Settings functional
- [ ] PWA installable
- [ ] Works offline
- [ ] Serbian localization complete
- [ ] Sound effects implemented
- [ ] Basic analytics

### 9.2 App Store Requirements
| Store | Requirements |
|-------|--------------|
| Google Play | Privacy policy, content rating, screenshots |
| App Store | Privacy policy, age rating, screenshots, iPad support |
| Web | Privacy policy, cookie consent |

---

## 10. Future Considerations (Post-MVP)

### 10.1 Phase 2 Features
- Cloud save / user accounts
- Leaderboards
- Teacher dashboard
- Classroom mode (multiplayer quiz)
- More chapters (acids, organic chemistry advanced)

### 10.2 Phase 3 Features
- Regional expansion (Croatia, Bosnia, Montenegro)
- Additional languages
- AR mode (view molecules in 3D)
- Parent progress reports
- School licensing program

---

## Appendix A: Serbian Curriculum Alignment

**7th Grade Chemistry Topics:**
1. Supstance i njihove osobine
2. Atomi, molekuli, joni
3. Periodni sistem elemenata
4. Hemijska veza
5. Oksidi
6. Kiseline i baze
7. Soli

**8th Grade Chemistry Topics:**
1. Hemijske reakcije
2. Rastvori
3. Ugljovodonici
4. Derivati ugljovodonika
5. Prirodni spojevi

---

## Appendix B: Competitive Reference

| App | Strengths to Emulate | Weaknesses to Avoid |
|-----|---------------------|---------------------|
| Toca Lab | Beautiful visuals, playful | No curriculum alignment |
| Periodic Table Game | Good quiz mechanics | Subscription wall |
| Duolingo | Progression system, streaks | Can feel repetitive |
| Kahoot | Engaging multiplayer | Not for solo learning |

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Author: [Your Name]*