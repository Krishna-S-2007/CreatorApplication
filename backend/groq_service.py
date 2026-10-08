import os
from typing import List
from dotenv import load_dotenv
try:
    from backend.models import ChatMessage
except ImportError:
    from models import ChatMessage

load_dotenv()

SQUAD_SYSTEM_PROMPT = """You are the official AI Assistant for "Wheaty Bisks Gaming", a high-energy gaming squad and YouTube channel (@wheatybisksgaming).

CHANNEL & SQUAD OVERVIEW:
- Bio: "Welcome To Wheaty Bisks Gaming. We are a small group of gamers mainly based in Ireland. We enjoy laughing at random things and having the craic."
- Home base: Dublin, Ireland. The vibe is friendly Irish banter ("having the craic"), high competitiveness, clutch ranked games, and late-night laughing fits.
- Channel Handle: @wheatybisksgaming (YouTube & Instagram)
- Core games: Overwatch 2, Rocket League, Fortnite, League of Legends, Rainbow Six Siege, FIFA/EA Sports FC, Dislyte, Warface, UFC 4.

THE 5 SQUAD MEMBERS:
1. Ryan (Captain / Editor | @ryan | Gamertag: RealRyan360 | #01):
   - Role: Squad captain, video editor, and tactical anchor.
   - Games & Signature Plays: Overwatch 2 tank/DPS master (famous for Ramattra team wipes in overtime, Junkrat plays, Sigma, Moira, Torbjörn, Zarya); Rocket League aerial finishes and defensive counter-attack stops; Fortnite precision sniper shots.
2. Jordan (Playmaker / Voice | @jordan | Gamertag: Jordinho | #02):
   - Role: Playmaker, on-mic hype voice, and match commentator.
   - Games & Signature Plays: Rocket League solo goal maestro, backboard pinches, and kickoff setups; squad communication wizard.
3. Emedic (Creator / Artist | @emedic | Gamertag: E Medic / @emedic0615 | #03):
   - Role: Squad artist, creator, and wholesome vibe keeper.
   - Games & Signature Plays: Overwatch 2 (Ramattra, Junkrat, Orisa); Creator of "Meowhardt" (legendary hybrid drawing of Fortnite's Meowscles and Overwatch's Reinhardt created in Rec Room); Slime Rancher; collector of gaming and Pokémon plushies.
4. CyanDragon (Squad Member / Creator | @cyandragon | Gamertag: Cyandragon | #04):
   - Role: Pure clutch fragger and DPS specialist.
   - Games & Signature Plays: Overwatch 2 (Bastion "go brrr", Doomfist, Echo team wipes, Zenyatta, Mei, Junker Queen); Rainbow Six Siege 1v4 clutch master.
5. aka JB (Squad Member / Creator | @akajb | Gamertag: JB / Chong Bling | #05):
   - Role: Energy creator, hype dancer, and competitive grinder.
   - Games & Signature Plays: Dislyte pack openings and patch note breakdowns; League of Legends (Ekko, best Diana EU-West); Fortnite duo wipes; UFC 4 knockouts; host of the WB Podcast (famous for his fiery Soccer Aid rants); known for hitting the griddy at the RDS and UCD in Dublin!

INSIDE JOKES & SQUAD LORE:
- "The Craic": Pure Irish humor and good times.
- "Meowhardt": Emedic's Rec Room masterpiece of Meowscles + Reinhardt.
- "JB hitting the griddy": Caught on tape hitting the griddy at the RDS arena and UCD in Dublin.
- "Pencil Quote of the day": A recurring squad meme and motivational reel.
- "Wheaty Bisks on Tour": The crew's trip to Italy visiting the San Siro in Milan for the Milan Derby.
- "National Anthems": Channel features iconic Irish sporting fixture anthems (Six Nations rugby at Aviva, U21 Euro Qualifiers, Women's World Cup Qualifiers, EuroBasket) demonstrating deep Irish sports pride.

WEBSITE SERVICES & INVITATIONS:
- Exclusive Waitlist (/waitlist): Members get behind-the-scenes access, early story drops, squad meet-ups, and match-day giveaways. Encourage users to join!
- Weekly Newsletter (/newsletter): Match-day stories and a legend's quote every Friday straight to their inbox.
- News Articles (/news): Coverage of tournament runs, match breakdowns, and squad art.

INSTRUCTIONS FOR REPLIES:
- Be upbeat, witty, authentic to Irish gamer camaraderie, and helpful.
- Speak on behalf of the Wheaty Bisks squad assistant.
- When asked about the squad, mention the 5 members, their specific roles and funny inside lore.
- Keep answers engaging, concise to medium length (2-4 paragraphs max), and clear.
- Never invent harmful or private personal details."""

async def generate_chat_reply(messages: List[ChatMessage]) -> str:
    load_dotenv(override=True)
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    model = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b").strip()

    # 1. If Groq API Key is present, call Groq Cloud via Python SDK
    if api_key:
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            formatted_messages = [{"role": "system", "content": SQUAD_SYSTEM_PROMPT}]
            for m in messages:
                formatted_messages.append({"role": m.role, "content": m.content})

            candidate_models = [model, "qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]
            seen = set()
            models_to_try = [m for m in candidate_models if m and not (m in seen or seen.add(m))]

            for candidate in models_to_try:
                try:
                    completion = client.chat.completions.create(
                        model=candidate,
                        messages=formatted_messages,
                        temperature=0.7,
                        max_tokens=1024,
                    )
                    reply = completion.choices[0].message.content
                    if reply and reply.strip():
                        return reply.strip()
                except Exception as model_err:
                    print(f"[Groq Service] Model {candidate} failed: {model_err}")
                    continue
        except Exception as e:
            print(f"[Groq Service] API client error, falling back to local engine: {e}")

    # 2. Intelligent Context-Aware Squad Fallback Engine (Zero downtime)
    last_user_msg = ""
    for m in reversed(messages):
        if m.role == "user":
            last_user_msg = m.content.lower()
            break

    return generate_squad_fallback_reply(last_user_msg)

def generate_squad_fallback_reply(msg: str) -> str:
    # Members questions
    if any(k in msg for k in ["who are", "members", "crew", "friends", "squad"]):
        return (
            "Wheaty Bisks Gaming is powered by five close friends based in Ireland who've been grinding ranked and having the craic together:\n\n"
            "1. ⚔️ **Ryan (#01 - Captain / Editor)**: Our tactical shot-caller and video editor (RealRyan360). Known for clutch Ramattra team wipes in Overwatch 2 and laser Rocket League counter-attacks.\n"
            "2. 🎙️ **Jordan (#02 - Playmaker / Voice)**: Jordinho! The voice on the comms and our top Rocket League playmaker.\n"
            "3. 🎨 **Emedic (#03 - Creator / Artist)**: The creative soul behind our legendary 'Meowhardt' mascot (Meowscles x Reinhardt), Rec Room drawings, and guardian of all gaming plushies.\n"
            "4. 🐉 **CyanDragon (#04 - Squad Member / Creator)**: Our cold-blooded clutch fragger (Bastion go brrr, Doomfist, and 1v4 Rainbow Six Siege clutches).\n"
            "5. ⚡ **aka JB (#05 - Squad Member / Creator)**: Chong Bling! Gacha master (Dislyte), League of Legends grinder (Ekko/Diana EUW), host of the WB Podcast, and champion of hitting the griddy at the RDS in Dublin!\n\n"
            "Want early access to squad match footage and meetups? Jump on our **Waitlist** or sign up for the **Newsletter**!"
        )

    # Ryan
    if any(k in msg for k in ["ryan", "realryan360", "captain"]):
        return (
            "**Ryan (RealRyan360)** is the captain and video editor of Wheaty Bisks Gaming! "
            "When he's not cutting together reels for our YouTube channel, he's anchoring the front line in Overwatch 2 on Ramattra, Junkrat, and Sigma, or pulling off high-speed aerials in Rocket League. "
            "He keeps the squad disciplined when lobbies get chaotic!"
        )

    # Jordan
    if any(k in msg for k in ["jordan", "jordinho"]):
        return (
            "**Jordan (Jordinho)** is our Playmaker and the voice behind the squad! "
            "He sets up the plays in Rocket League with slick wall passes and solo goals, and brings the hype on the mic for all our squad highlights and podcasts."
        )

    # Emedic / Meowhardt
    if any(k in msg for k in ["emedic", "meowhardt", "art", "plush"]):
        return (
            "**Emedic (@emedic0615)** is our squad artist and creator! "
            "He's the mastermind behind **Meowhardt** — the epic mashup drawing of Fortnite's Meowscles and Overwatch's Reinhardt that he drew in Rec Room. "
            "He plays Ramattra and Junkrat in Overwatch 2, loves Slime Rancher, and his setup is stacked with cute Pokémon plushies."
        )

    # CyanDragon
    if any(k in msg for k in ["cyan", "cyandragon"]):
        return (
            "**CyanDragon** is our ice-cold clutch machine! "
            "Whether he's wiping the entire lobby as Bastion or Echo in Overwatch 2, or winning a 1v4 match-point defense in Rainbow Six Siege, Cyan is the teammate you want alive when the chips are down."
        )

    # JB / Chong Bling
    if any(k in msg for k in ["jb", "chong", "dislyte", "griddy"]):
        return (
            "**aka JB (Chong Bling)** is pure unfiltered energy! "
            "He covers Dislyte pack openings and patch notes, claims the title of best Diana EU-West in League of Legends, drops rants on the WB Podcast, and is immortalized for hitting the griddy at the RDS and UCD in Dublin. Never a dull moment when JB is in the lobby!"
        )

    # YouTube / Channel / Origin
    if any(k in msg for k in ["youtube", "channel", "ireland", "irish", "dublin"]):
        return (
            "We are **Wheaty Bisks Gaming** (@wheatybisksgaming on YouTube & Instagram)! "
            "We're an Irish gaming collective based around Dublin. We started the channel to share our ranked highlights, funny moments, and pure Irish craic. "
            "On our channel, you'll find clips across Overwatch 2, Rocket League, Fortnite, League of Legends, as well as highlights from our trips like the San Siro in Milan and Irish sports fixtures!"
        )

    # Waitlist
    if any(k in msg for k in ["waitlist", "access", "join", "exclusive"]):
        return (
            "You can join our **Exclusive Waitlist** right here on the website (/waitlist)! "
            "Signing up gives you priority access to behind-the-scenes squad footage, early story releases, crew meetups, and matchday giveaways. "
            "Just enter your name, email, and pick what you'd like first — we'll notify you as soon as doors open!"
        )

    # Newsletter
    if any(k in msg for k in ["newsletter", "email", "subscribe"]):
        return (
            "Our **Weekly Newsletter** (/newsletter) drops matchday stories and quotes from sporting legends straight to your inbox every Friday. "
            "Drop your email and favourite club on the Newsletter page so you never miss a kickoff!"
        )

    # Games
    if any(k in msg for k in ["game", "overwatch", "rocket league", "fortnite"]):
        return (
            "The squad plays a heavy mix of competitive and casual games:\n\n"
            "• **Overwatch 2**: Ranked grinds with Ryan on Ramattra/Sigma, CyanDragon on Bastion/Echo, and Emedic holding the point.\n"
            "• **Rocket League**: 2v2 and 3v3 aerial counters, Hoops pinches, and Jordan's solo finishes.\n"
            "• **Fortnite**: Squad wipes, sniping clips, and festival events like Metallica Fuel Fire Fury.\n"
            "• **League of Legends**: JB grinding Ekko and Diana on EUW.\n"
            "• Plus Rainbow Six Siege, FIFA, Dislyte, and Warface!"
        )

    # Default friendly greeting
    return (
        "Welcome to the Wheaty Bisks squad assistant! 🎮 We're five friends from Ireland (Ryan, Jordan, Emedic, CyanDragon, and aka JB) streaming high-stakes gameplay, laughing at chaotic lobbies, and having the craic.\n\n"
        "You can ask me about our members, our favourite games (Overwatch 2, Rocket League, Fortnite, League), our YouTube highlights, or how to get on the exclusive Waitlist and Newsletter. What's on your mind?"
    )
