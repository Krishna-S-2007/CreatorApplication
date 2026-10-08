import json
import os
import re
import time
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from backend.models import WaitlistEntry, NewsletterSubscriber, NewsArticle, NewsArticleCreate

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
DB_FILE = os.path.join(DATA_DIR, "database.json")

def get_initial_articles() -> List[Dict[str, Any]]:
    return [
        {
            "id": "art-1",
            "title": "Overwatch 2 Tank Meta Guide: How to Master Ramattra's Brawl & Tempo Shifts",
            "slug": "overwatch-2-tank-meta-ramattra-brawl-guide",
            "summary": "Deep-dive competitive guide on armor pool mechanics, Nemesis Form pummel cycling, and anti-dive positioning with high-rank case studies from Captain Ryan (RealRyan360).",
            "content": """### Current Tank Meta Breakdown

Recent balance adjustments in competitive Overwatch 2 have re-centered the meta around durable brawl and poke frontlines. With reductions to burst headshot multipliers and adjustments to tank knockback resistance, aggressive brawl heroes have overtaken fragile dive tanks on hybrid and push maps like Esperança and Colosseo.

Among the tank roster, **Ramattra** has solidified his spot as an S-tier pick due to his ability to toggle between long-range suppression and close-quarters brawl presence.

---

### Key Mechanics & Ability Cycling

#### 1. Void Barrier Timing
Never throw your Void Barrier preemptively before the fight begins. Save it specifically to block high-impact enemy cooldowns:
- Ana's Biotic Grenade and Sleep Dart.
- Bastion's Configuration: Assault fire.
- Roadhog's Chain Hook.
Use natural cover for baseline poke damage, and deploy the barrier only when stepping forward into open choke points.

#### 2. Nemesis Form & Block Cycling
Nemesis Form provides 225 bonus armor and punch attacks that pierce shields (such as Reinhardt's Barrier and Winston's Bubble). 
- **The Golden Rule**: Never hold primary fire blindly. Weave your Block (which mitigates 75% of incoming frontal damage) between punches when enemy damage spikes.
- Pair Nemesis Form with **Ravenous Vortex** to slow nimble heroes like Tracer and Genji, preventing them from escaping your Pummel range.

#### 3. Annihilation in Overtime
Annihilation deals constant area-of-effect damage while slowing down Ramattra's ultimate drain timer as long as enemies are tethered.
- Stay near the payload or robot rather than chasing single supports into rooms.
- Hold Block whenever focused by multiple enemies, allowing your supports to keep you sustained while your aura chips away at their team.

---

### Squad Case Study: Captain Ryan (RealRyan360) on Esperança

In a recent ranked match featured on our channel (@wheatybisksgaming), **Captain Ryan (Gamertag: RealRyan360)** faced an aggressive Winston/Tracer dive comp contesting checkpoint 2 on Esperança in overtime:

> *"The enemy Winston jumped past our frontline to target our supports. Instead of turning back and conceding the objective, I dropped Ravenous Vortex behind the robot choke to ground Tracer's blinks, entered Nemesis Form, and pummeled straight through Winston's barrier while blocking his secondary lightning. With CyanDragon's Bastion providing suppressive crossfire, the enemy dive collapsed in under 4 seconds."*

---

### Pro Tips for Climbing Ranked
1. **Track Enemy CC Cooldowns**: Don't activate Annihilation until Ana uses her Sleep Dart or Sombra reveals her position.
2. **Ping Target Priorities**: Ramattra's punches pierce shields, making him ideal for melting out-of-position Zenyattas and Baptistes.
3. **Know When to Swap**: If the enemy team runs heavy airborne poke (Pharah / Echo) on long sightlines, swap to Sigma for better barrier versatility.""",
            "author": "Ryan",
            "authorHandle": "RealRyan360 (@ryan)",
            "category": "Match Report",
            "readTime": "5 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "art-2",
            "title": "Rocket League 2v2 Competitive Blueprint: Backboard Rotations & Counter-Attacks",
            "slug": "rocket-league-2v2-competitive-rotations-blueprint",
            "summary": "Master the 3 golden rotation rules of 2v2, 50/50 challenge baits, and backboard aerial clearances with tactical breakdowns from Jordan (Jordinho) and Ryan (RealRyan360).",
            "content": """### Why Traditional 2v2 Rotations Fail

In Diamond and Champion lobbies, the number-one reason duos lose games is **double-committing in offensive corners**. When both teammates push deep into the corner hoping for a centering pass, an unlucky 50/50 pinch instantly converts into an open net goal for the opposition.

To consistently climb the competitive 2v2 ladder, you must replace passive goal-line defending with **dynamic backboard shadowing and fast counter-attacks**.

---

### The 3 Golden Rules of 2v2 Positioning

#### 1. Staggered Spacing on Corner Challenges
- **Player 1 (Challenger)**: Attack the ball with the intention of forcing a low 50/50. Do not flip commit into the wall if you don't have a clear angle.
- **Player 2 (Support)**: Never wait on the near post. Position yourself at mid-field or on the defensive backboard. If the ball pinches high, you have full aerial trajectory to clear it cleanly over charging attackers.

#### 2. The Mid-Field Boost Steal & Starvation
When your teammate has pressure, do not retreat all the way back to your corner for a 100-boost pad. Instead, path through small boost pads (3 pads = 36 boost, which is plenty for a ceiling save) and steal the opponent's mid-boost. Starving opponents of boost forces awkward weak clears.

#### 3. Fast Aerial Clears
Learn the **fast aerial mechanic** (jump + tilt back + boost + double-jump without backflipping). Reaching the ball half a second earlier lets you clear the ball high toward the opponent's half rather than weakly grounding it into the center.

---

### Squad Case Study: Jordan (Jordinho) & Ryan (RealRyan360)

In Wheaty Bisks Gaming's competitive matches, **Jordan (Gamertag: Jordinho)** and **Ryan (Gamertag: RealRyan360)** have refined their signature counter-attack transition:

> *"When opponents send a booming shot toward our crossbar, Ryan anchors the goal line to make the low-save save. That allows me (Jordinho) to pre-jump from the back-post wall, meet the rebound off the backboard in mid-air, and launch a direct aerial counter. In our YouTube Shorts clips, like our halfway line flicks and Hoops pinches, over 70% of our goals stem from fast backboard clearances rather than slow ground dribbles."*

---

### Practical Training Pack Checklist
- **Fast Aerial Consistency**: Practice jumping immediately after boost initiation to eliminate backflip errors.
- **Half-Flips**: Essential for rapid 180-degree defensive recoveries.
- **Patience on 50/50s**: Let the aggressive attacker jump into you; hold your ground with a single jump to absorb their momentum.""",
            "author": "Jordan",
            "authorHandle": "Jordinho (@jordan)",
            "category": "Tournament",
            "readTime": "5 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "art-3",
            "title": "Fortnite Chapter Meta Guide: Bullet Drop Mastery, Rotation Items & Moving Zones",
            "slug": "fortnite-chapter-meta-bullet-drop-loadouts",
            "summary": "Actionable guide on adapting to projectile sniper physics, optimal 5-slot tournament inventory management, and high-ground endgame storm rotations with aka JB (Chong Bling).",
            "content": """### Adapting to the Projectile Sandbox

Recent updates to Fortnite's weapon mechanics have fundamentally changed gunplay by introducing **bullet travel time and bullet drop** across all major marksman rifles and snipers. The days of hitscan long-range point-and-click are gone; success now depends on leading targets and calculating range.

---

### Bullet Drop Range Calculation
- **0–75 meters**: Aim directly at the target's upper chest / neck. Bullet drop is negligible.
- **75–150 meters**: Place crosshair 1 chevron (tick mark) above the opponent's head.
- **150+ meters on sprinting targets**: Aim 1.5 body-widths ahead of the runner and half a head above their model.

---

### Optimal 5-Slot Ranked Loadout
1. **Primary AR / Burst**: Mid-range pressure and wall bleeding.
2. **Shotgun (Gatekeeper / Pump)**: High burst close-quarters combat (aim for 100+ headshot tags).
3. **Utility / Sniper**: Heavy sniper for picking rotating opponents or structure breaches.
4. **Mobility Item**: Shockwave Grenades, Grapple Blade, or Wings to reposition instantly when caught low ground.
5. **Stacked Healing**: Always carry stackable shields (3x Big Pots or 6x Mini Shields) instead of medkits, prioritizing quick 50-shield recovery during build fights.

---

### Squad Case Study: aka JB (Chong Bling) on Endgame Rotations

During Wheaty Bisks squad sessions, **aka JB (Gamertag: Chong Bling)** and Ryan coordinate late-game rotations in moving storm zones:

> *"When the 5th and 6th storm circles start pulling over mountains, low-ground players get shredded by storm surge and falling structures. We use shockwaves to claim natural high ground early before the zone moves. Once on top, we set up cross-angles: Ryan holds thermal sniper sightlines while I watch the back flank. That high-ground setup earned us multiple duo wipe victories featured on our channel."*

---

### Pro Tips for Ranked Play
- **Never Peak the Same Window Twice**: Good snipers pre-aim your last peek spot; always change levels or rotate windows.
- **Conserve Mobility for Moving Zones**: Avoid burning shockwaves for early-game loot; save them for the 10-second sprint across open valleys in final circles.
- **Hard Materials in Endgame**: Switch to Metal or Brick for your endgame boxes; wood is easily melted by spray weapons.""",
            "author": "aka JB",
            "authorHandle": "Chong Bling (@akajb)",
            "category": "Squad News",
            "readTime": "5 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "art-4",
            "title": "League of Legends Mid-Lane Roaming Guide: Dominating EUW with Diana & Ekko",
            "slug": "league-of-legends-mid-lane-roam-guide-diana-ekko",
            "summary": "Master mid-lane wave crashes, 40-second roam windows, and AP assassin burst sequences on EUW with practical advice from aka JB (Chong Bling).",
            "content": """### The State of Mid-Lane on Summoner's Rift

With map terrain widened around river bushes and the introduction of Voidgrubs, mid-lane is no longer about sitting back and farming 200 CS. Mid-laners who can rapidly push waves, secure river priority, and execute lethal dives on side-lanes dictate the pace of the entire match.

---

### Wave Management & The Roam Timer

#### The Level 3 Cannon Wave Push
The foundation of effective mid-lane roaming is the **cannon wave crash**:
1. Slowly last-hit waves 1 and 2 to build a stacked minion wave.
2. Hard-shove wave 3 (the cannon wave) directly into the enemy mid-laner's tower.
3. This forces the opponent to stay under turret clearing 8+ minions, granting you an **uncontested 35-40 second roam window** without losing any gold or tower plates.

#### Pathing & Vision Control
- Never path straight through river brushes if unwarded.
- Walk through your own jungle and wrap behind the enemy bot-lane's tri-brush or river alcove.
- Keep a Control Ward in the enemy raptor camp to track the enemy jungler's pathing before committing to an all-in dive.

---

### Champion Breakdown: Diana vs. Ekko

#### Diana — The Teamfight Wrecker
- **Core Build**: Lich Bane ➔ Sorcerer's Shoes ➔ Shadowflame ➔ Zhonya's Hourglass.
- **Burst Sequence**: Q (Crescent Strike) ➔ E (Lunar Rush) ➔ W (Pale Cascade) ➔ R (Moonfall). Always ensure Q hits before casting E to reset your dash cooldown.
- **Dragon Pit Domination**: Use Moonfall when the enemy team gathers around the dragon pit entrance to pull 3+ champions into allied area-of-effect abilities.

#### Ekko — The Untouchable Dive Specialist
- **Core Build**: Hextech Rocketbelt ➔ Lich Bane ➔ Rabadon's Deathcap.
- **Tower Dive Safety**: Throw W (Parallel Convergence) behind the enemy tower, dash in with E, burst with Q and auto-attack to proc your passive movement speed, then cast R (Chronobreak) to rewind back to safety with zero damage taken.

---

### Squad Case Study: aka JB (Chong Bling) on EUW Ranked

Known across the squad as the self-proclaimed *"Best Diana EU-West"*, **aka JB (Gamertag: Chong Bling)** breaks down his competitive approach:

> *"In solo queue on EUW, enemy bot-laners consistently overextend when they see their mid-laner farming under tower. By timing my wave shove right before dragon spawns, I can drop down to bot-lane, land a full Lunar Rush into Moonfall combo, and secure a double kill before their mid-laner can even ping missing. Even when we traveled to Italy for the Milan Derby, I was reviewing wave states and jungle timers in our match breakdowns!"*

---

### Key Takeaways for Ranked Climbers
- If your roam fails to find a kill, do not linger in the side-lane; rotate back immediately so your wave doesn't bounce into an enemy freeze.
- Prioritize Voidgrub fights at 5 minutes; having grub push power makes mid-lane towers melt.""",
            "author": "aka JB",
            "authorHandle": "Chong Bling (@akajb)",
            "category": "Match Report",
            "readTime": "5 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "art-5",
            "title": "Rainbow Six Siege Retake Guide: Directional Audio, Angle Slicing & Overtime Clutches",
            "slug": "rainbow-six-siege-retake-audio-clutch-guide",
            "summary": "How to isolate 1v1 gunfights, leverage acoustic sound propagation through breached walls, and defuse post-plants with tactical lessons from CyanDragon (Cyandragon).",
            "content": """### Understanding Directional Sound Propagation

In tactical shooters like Tom Clancy's Rainbow Six Siege, audio is your primary weapon. Unlike other FPS games where sound travels in straight lines through geometry, Siege uses **acoustic propagation**:
- Sound always travels through the **closest physical opening** (breached murder holes, drone vents, open doorways, or destroyed barricades).
- Punching a small melee hole in a soft wall allows audio from adjacent rooms to reach you without revealing your body position.

---

### The Anatomy of a 1vX Retake

When you are the last defender or attacker alive against multiple opponents, your goal is **never to fight two people at once**:

#### 1. Angle Slicing (Pieing the Corner)
Never peek around a corner in one wide swing. Clear angles incrementally:
- Clear the shallow angle (15 degrees), pause.
- Step out to 45 degrees, pause.
- Step out to 90 degrees.
This ensures you only expose your hitboxes to one enemy crosshair at a time.

#### 2. Sound Baiting & The Fake Defuse
On post-plant bomb retakes:
- Tap the defuser for 0.5 seconds to trigger the audio prompt.
- Instantly cancel and pre-aim the nearest doorway.
- Defenders almost always rush to peek when they hear the defuse sound, giving you an easy pre-fire headshot.

#### 3. Crosshair Placement & First-Shot Recoil
Keep your crosshair locked at standing head level when holding doors, and crouch level when clearing corners. High-fire-rate SMGs (like the MP5 or MPX) must be burst-fired at range to avoid muzzle climb.

---

### Squad Case Study: CyanDragon (Cyandragon) — The 1v4 Consulate Clutch

In one of the most celebrated clips on the Wheaty Bisks Gaming channel, **CyanDragon (Gamertag: Cyandragon)** found himself in an impossible 1v4 post-plant on Consulate with 35 seconds on the clock:

> *"The enemy squad was confident and pushed individually looking for the final frag. By tracking footstep propagation through the upper corridor hole, I held tight crosshairs and eliminated two attackers as they sprinted through the hallway. For the final two defenders, I threw smoke onto the bomb chassis, tapped the defuser to bait the peek, landed the headshot through the smoke haze, and completed the defuse with 0.4 seconds left on the match clock."*

---

### Practical Retake Checklist
- Keep your drone alive in the prep phase; place it in your planned entry room for quick intel.
- Never sprint in final 30 seconds; sprint-to-fire delay will cost you the gunfight.
- Remember: the defuse takes 7 seconds; initiate your defuse before 0:07 on the timer.""",
            "author": "CyanDragon",
            "authorHandle": "Cyandragon (@cyandragon)",
            "category": "Match Report",
            "readTime": "5 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "art-6",
            "title": "Creator Audio & Production Guide: OBS Multi-Track Routing & Rec Room 3D Asset Design",
            "slug": "creator-audio-obs-rec-room-3d-design-guide",
            "summary": "Professional setup guide on routing Discord comms and game audio into separate tracks, plus 3D asset modeling pipelines in Rec Room by Emedic (E Medic).",
            "content": """### Professional Multi-Track Audio Routing for Gaming Creators

One of the most frustrating problems for gaming groups is recording squad sessions where Discord voice chat bleeds into game audio. If someone coughs or game volume spikes, the entire video clip is ruined.

Here is how to set up **clean multi-track audio routing** in OBS Studio:

---

### Step-by-Step OBS Audio Configuration

#### 1. Enable Application Audio Output Capture
Rather than capturing 'Desktop Audio' as a single source:
- Add Source ➔ **Application Audio Capture (BETA)** ➔ Select your Game (e.g., Overwatch 2 / Rocket League).
- Add Source ➔ **Application Audio Capture** ➔ Select Discord.
- Add Source ➔ **Audio Input Capture** ➔ Select your Microphone.

#### 2. Advanced Audio Properties Matrix
Open Edit ➔ Advanced Audio Properties, and assign each source to dedicated recording tracks:
- **Track 1 (Master Mix)**: Game + Discord + Mic (for live preview or streams).
- **Track 2 (Game Only)**: Overwatch / Rocket League audio.
- **Track 3 (Voice Comms Only)**: Discord squad chat.
- **Track 4 (Microphone Only)**: Your personal microphone.

In your video editor (Premiere Pro, DaVinci Resolve, or CapCut), each track appears as an independent audio layer. You can mute a background Discord comment or boost your own voice without affecting the in-game sound effects.

---

### 3D Character Asset Design in Rec Room

Beyond video production, **Emedic (Gamertag: E Medic / @emedic0615)** specializes in character concept art and 3D modeling using Rec Room's Maker Pen:

#### The Genesis of 'Meowhardt'
How did the squad's official mascot come to life?
1. **Concept Fusion**: Combining the feline muscle physique of Fortnite's Meowscles with the German crusader armor and rocket hammer of Overwatch's Reinhardt.
2. **Wireframe Prototyping**: Over 14 hours sculpting geometric primitives inside Rec Room's virtual canvas.
3. **Texture & Lighting**: Applying metallic gradients and neon accents to capture the squad's high-octane gaming aesthetic.

> *"When designing gaming assets or community merchandise, balance is everything," Emedic explains. "Whether it's designing Meowhardt stickers for our exclusive waitlist members or setting up dual-channel audio interfaces for late-night laughing fits, good production habits make great squad content."*

---

### Key Takeaways for New Creators
- Always record in `.mkv` format in OBS; if your PC crashes, `.mkv` saves your footage, whereas `.mp4` corrupts.
- Use a dynamic microphone with a pop filter to minimize mechanical keyboard click bleed.
- Export YouTube Shorts in 1080x1920 (9:16 vertical) at 60fps with high bitrate (15-20 Mbps) for crisp mobile playback.""",
            "author": "Emedic",
            "authorHandle": "E Medic (@emedic0615)",
            "category": "Art & Community",
            "readTime": "5 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "art-7",
            "title": "Dislyte Speed Tuning & Miracle Dungeon Guide: Kronos & Apep Cleave Strategies",
            "slug": "dislyte-speed-tuning-miracle-dungeon-guide",
            "summary": "Master turn-one AP manipulation, relic resonance stat thresholds, and sub-60-second Miracle boss speed clears with aka JB (Chong Bling).",
            "content": """### The Fundamentals of Dislyte Speed Tuning

In turn-based gacha RPGs like Dislyte, victory is determined before the first ability is cast. **Action Point (AP) manipulation** and strict **Speed (SPD) tuning** dictate whether your team wipes the enemy wave or gets wiped before taking a turn.

---

### The Speed Cleave Turn Order

To guarantee sub-60-second runs in Ritual Miracle dungeons (Kronos and Apep):

#### Turn 1: Primary AP Pusher (Dhalia / Unas / Tiye)
- Needs **maximum SPD relics** (Wind set with SPD main stat on the Mui II relic).
- Goal: Move first, boost the entire team's Action Point bar by 25-30%, and provide an ATK/CRIT rate buff.

#### Turn 2: Defense Breaker (Gabrielle / Lin Xiao)
- Must be tuned to move immediately after your AP pusher (within 5-10 SPD).
- Applies team-wide DEF Down to weaken the boss and add immunity buffs to your allies.

#### Turn 3 & 4: Primary Single-Target / AOE DPS (Gaius / Sander / Brewster)
- Built with high ATK, 100% CRIT Rate, and 250%+ CRIT DMG.
- Exploit the defense-broken targets to burst the boss before shield or counter-attack phases trigger.

---

### Squad Case Study: aka JB (Chong Bling)'s Gacha Summons & Patch Analysis

Across the Wheaty Bisks Gaming channel, **aka JB (Gamertag: Chong Bling)** is known for his in-depth patch note reviews and legendary summon streams:

> *"In our 'JB reads the V3.3.7 Patch Notes' video and our summon series, we analyzed how relic set bonuses shift turn-one damage thresholds. If your damage dealer lacks enough speed to move before Kronos' boulder slam, your entire run collapses. Getting the right resonance on legendary espers makes the difference between consistent auto-farming and constant wipes."*

---

### Relic Optimization Checklist
- Prioritize **SPD substat rolls** on all 6 relic pieces.
- For Kronos: Focus on Wind + Fiery set bonuses for speed and crit consistency.
- For Apep: Run Nether relics for life-steal sustain against poison stacks.""",
            "author": "aka JB",
            "authorHandle": "Chong Bling (@akajb)",
            "category": "Podcast",
            "readTime": "4 min read",
            "publishedAt": datetime.utcnow().isoformat() + "Z"
        }
    ]

class Database:
    def __init__(self):
        self._ensure_dir()
        self.data = self._load()

    def _ensure_dir(self):
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR, exist_ok=True)

    def _load(self) -> Dict[str, Any]:
        self._ensure_dir()
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                    return {
                        "waitlist": raw.get("waitlist", []),
                        "newsletter": raw.get("newsletter", []),
                        "articles": raw.get("articles") if raw.get("articles") else get_initial_articles(),
                        "chatLogs": raw.get("chatLogs", []),
                    }
            except Exception as e:
                print(f"[Database] Failed to read db file: {e}")

        initial = {
            "waitlist": [],
            "newsletter": [],
            "articles": get_initial_articles(),
            "chatLogs": [],
        }
        self._save(initial)
        return initial

    def _save(self, data: Optional[Dict[str, Any]] = None):
        self._ensure_dir()
        target = data if data is not None else self.data
        temp_file = f"{DB_FILE}.tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(target, f, indent=2, ensure_ascii=False)
        os.replace(temp_file, DB_FILE)

    # --- Waitlist Methods ---
    def get_waitlist(self) -> List[Dict[str, Any]]:
        return self.data.get("waitlist", [])

    def add_waitlist_entry(self, name: str, email: str, interests: List[str]) -> Tuple[Optional[Dict[str, Any]], bool]:
        clean_email = email.strip().lower()
        for w in self.data["waitlist"]:
            if w.get("email", "").lower() == clean_email:
                return None, True

        entry = {
            "id": f"w-{int(time.time() * 1000)}",
            "name": name.strip(),
            "email": clean_email,
            "interests": interests,
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }
        self.data["waitlist"].insert(0, entry)
        self._save()
        return entry, False

    def delete_waitlist_entry(self, entry_id: str) -> bool:
        before = len(self.data["waitlist"])
        self.data["waitlist"] = [w for w in self.data["waitlist"] if w.get("id") != entry_id]
        if len(self.data["waitlist"]) != before:
            self._save()
            return True
        return False

    # --- Newsletter Methods ---
    def get_newsletter(self) -> List[Dict[str, Any]]:
        return self.data.get("newsletter", [])

    def add_newsletter_subscriber(self, email: str, first_name: Optional[str] = None, favourite_club: Optional[str] = None) -> Tuple[Optional[Dict[str, Any]], bool]:
        clean_email = email.strip().lower()
        for n in self.data["newsletter"]:
            if n.get("email", "").lower() == clean_email:
                return None, True

        subscriber = {
            "id": f"n-{int(time.time() * 1000)}",
            "email": clean_email,
            "firstName": first_name.strip() if first_name else None,
            "favouriteClub": favourite_club.strip() if favourite_club else None,
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }
        self.data["newsletter"].insert(0, subscriber)
        self._save()
        return subscriber, False

    def delete_newsletter_subscriber(self, sub_id: str) -> bool:
        before = len(self.data["newsletter"])
        self.data["newsletter"] = [n for n in self.data["newsletter"] if n.get("id") != sub_id]
        if len(self.data["newsletter"]) != before:
            self._save()
            return True
        return False

    # --- News Articles Methods ---
    def get_articles(self, category: Optional[str] = None, query: Optional[str] = None) -> List[Dict[str, Any]]:
        articles = list(self.data.get("articles", []))
        if category and category.lower() != "all":
            articles = [a for a in articles if a.get("category", "").lower() == category.lower()]
        if query:
            q = query.lower()
            articles = [
                a for a in articles
                if q in a.get("title", "").lower() or q in a.get("summary", "").lower() or q in a.get("content", "").lower() or q in a.get("author", "").lower() or q in a.get("authorHandle", "").lower()
            ]
        return articles

    def get_article(self, identifier: str) -> Optional[Dict[str, Any]]:
        for a in self.data.get("articles", []):
            if a.get("slug") == identifier or a.get("id") == identifier:
                return a
        return None

    def add_article(self, article_data: NewsArticleCreate) -> Dict[str, Any]:
        slug = re.sub(r"[^a-z0-9]+", "-", article_data.title.lower()).strip("-")
        article = {
            "id": f"art-{int(time.time() * 1000)}",
            "title": article_data.title.strip(),
            "slug": slug or f"article-{int(time.time())}",
            "summary": article_data.summary.strip() if article_data.summary else article_data.title.strip(),
            "content": article_data.content.strip(),
            "author": article_data.author.strip() if article_data.author else "Wheaty Bisks Crew",
            "authorHandle": article_data.authorHandle.strip() if article_data.authorHandle else "@wheatybisksgaming",
            "category": article_data.category or "Squad News",
            "readTime": article_data.readTime.strip() if article_data.readTime else "5 min read",
            "coverImage": article_data.coverImage,
            "publishedAt": datetime.utcnow().isoformat() + "Z",
        }
        self.data["articles"].insert(0, article)
        self._save()
        return article

    def delete_article(self, article_id: str) -> bool:
        before = len(self.data["articles"])
        self.data["articles"] = [a for a in self.data["articles"] if a.get("id") != article_id]
        if len(self.data["articles"]) != before:
            self._save()
            return True
        return False

    # --- Chat Logs ---
    def log_chat(self, user_msg: str, assistant_reply: str):
        entry = {
            "id": f"chat-{int(time.time() * 1000)}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "userMessage": user_msg,
            "assistantReply": assistant_reply,
        }
        self.data.setdefault("chatLogs", []).insert(0, entry)
        if len(self.data["chatLogs"]) > 100:
            self.data["chatLogs"] = self.data["chatLogs"][:100]
        self._save()

    def get_stats(self) -> Dict[str, int]:
        return {
            "waitlistCount": len(self.data.get("waitlist", [])),
            "newsletterCount": len(self.data.get("newsletter", [])),
            "articlesCount": len(self.data.get("articles", [])),
            "recentChatsCount": len(self.data.get("chatLogs", [])),
        }

db = Database()
