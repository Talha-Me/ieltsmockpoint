import asyncio
import os
import edge_tts

VOICE_MALE = 'en-GB-RyanNeural'
VOICE_FEMALE = 'en-GB-SoniaNeural'

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/audio/speaking'))
os.makedirs(OUT_DIR, exist_ok=True)

CLIPS_FEMALE = {
    "welcome_intro": "Good day. My name is Dr. Sarah Jenkins, and I will be your IELTS speaking examiner today. In this first part of the test, I would like to ask you some questions about yourself and your everyday life.",
    "part2_intro": "Now, in this second part of the test, I am going to give you a topic, and I would like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. You can make some notes if you wish. Here is your task card.",
    "part2_start_speaking": "All right, remember you have up to two minutes for this, so don't worry if I stop you. Please begin speaking now.",
    "part3_intro": "Thank you. Now, in Part 3, we are going to discuss some more general questions related to the topic you have just spoken about."
}

CLIPS_MALE = {
    "welcome_intro": "Good day. My name is Dr. Oliver Bennett, and I will be your IELTS speaking examiner today. In this first part of the test, I would like to ask you some questions about yourself and your everyday life.",
    "part2_intro": "Now, in this second part of the test, I am going to give you a topic, and I would like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. You can make some notes if you wish. Here is your task card.",
    "part2_start_speaking": "All right, remember you have up to two minutes for this, so don't worry if I stop you. Please begin speaking now.",
    "part3_intro": "Thank you. Now, in Part 3, we are going to discuss some more general questions related to the topic you have just spoken about."
}

TESTS = [
    {
        "id": 1,
        "p1": [
            "Let's start with your hometown. Where are you from?",
            "What do you like most about living in your hometown?",
            "Do you prefer spending your free time indoors or outdoors? Why?",
            "Do you think your hometown has changed much over the last few years?"
        ],
        "p3": [
            "How has modern technology changed the way people plan and experience travel today?",
            "Do you think international travel helps people understand and respect different cultures?",
            "What are some negative environmental or social impacts of mass tourism on popular destinations?",
            "In the future, do you think people will travel more or less than they do now? Why?"
        ]
    },
    {
        "id": 2,
        "p1": [
            "Do you work or are you a student?",
            "What do you find most interesting or challenging about what you do?",
            "How often do you use your mobile phone during a typical day?",
            "What kind of weather do you enjoy the most?"
        ],
        "p3": [
            "Do you think it is important for young people to have high ambitions in life?",
            "Why do some people achieve their goals while others give up easily?",
            "How has the pressure to succeed in modern careers changed compared to the past?",
            "Do you believe money is the only true measure of success in today's society?"
        ]
    },
    {
        "id": 3,
        "p1": [
            "What kind of food do you like to eat the most?",
            "Do you know how to cook? Why or why not?",
            "What is your favourite part of the day, and why?",
            "Do you enjoy reading books or articles in your spare time?"
        ],
        "p3": [
            "What skills are most important for solving complex problems effectively?",
            "Should schools focus more on teaching practical problem-solving rather than rote memorization?",
            "How can artificial intelligence assist humans in making critical decisions?",
            "Are people today becoming too dependent on technology to solve everyday problems?"
        ]
    },
    {
        "id": 4,
        "p1": [
            "How much time do you spend with your friends every week?",
            "What qualities do you value most in a close friend?",
            "Do you enjoy listening to music while studying or relaxing?",
            "What kinds of sports or physical activities do you like?"
        ],
        "p3": [
            "Why is it essential for a society to preserve its traditional customs and heritage?",
            "Has globalization caused traditional local festivals to lose their original meaning?",
            "Do young people today celebrate traditional events with the same enthusiasm as older generations?",
            "How can governments and communities encourage youth to value national traditions?"
        ]
    },
    {
        "id": 5,
        "p1": [
            "Do you prefer shopping online or visiting physical stores?",
            "What was the last item you bought that you were really satisfied with?",
            "How often do you use public transport like buses or trains?",
            "What is your favourite colour, and why?"
        ],
        "p3": [
            "Why has continuous skill development become so critical in the modern workforce?",
            "Do you think practical work experience is more valuable than academic degrees?",
            "Which human skills will remain indispensable even as automation and AI advance?",
            "How should education systems adapt to prepare students for jobs that don't exist yet?"
        ]
    }
]

async def generate():
    # 1. Male Standard clips
    for key, text in CLIPS_MALE.items():
        fname = os.path.join(OUT_DIR, f"m_{key}.mp3")
        if not os.path.exists(fname):
            comm = edge_tts.Communicate(text, VOICE_MALE)
            await comm.save(fname)
            print(f"Generated m_{key}.mp3")

    # Also ensure female f_ clips exist for consistency
    for key, text in CLIPS_FEMALE.items():
        fname = os.path.join(OUT_DIR, f"f_{key}.mp3")
        if not os.path.exists(fname):
            comm = edge_tts.Communicate(text, VOICE_FEMALE)
            await comm.save(fname)
            print(f"Generated f_{key}.mp3")

    # 2. Male and Female Question Clips for Tests 1-5
    for t in TESTS:
        t_id = t["id"]
        # Part 1 questions
        for idx, q in enumerate(t["p1"]):
            fname_m = os.path.join(OUT_DIR, f"m_t{t_id}_p1_q{idx}.mp3")
            if not os.path.exists(fname_m):
                comm = edge_tts.Communicate(q, VOICE_MALE)
                await comm.save(fname_m)
                print(f"Generated m_t{t_id}_p1_q{idx}.mp3")

            fname_f = os.path.join(OUT_DIR, f"f_t{t_id}_p1_q{idx}.mp3")
            if not os.path.exists(fname_f):
                comm = edge_tts.Communicate(q, VOICE_FEMALE)
                await comm.save(fname_f)
                print(f"Generated f_t{t_id}_p1_q{idx}.mp3")
        
        # Part 3 questions
        for idx, q in enumerate(t["p3"]):
            fname_m = os.path.join(OUT_DIR, f"m_t{t_id}_p3_q{idx}.mp3")
            if not os.path.exists(fname_m):
                comm = edge_tts.Communicate(q, VOICE_MALE)
                await comm.save(fname_m)
                print(f"Generated m_t{t_id}_p3_q{idx}.mp3")

            fname_f = os.path.join(OUT_DIR, f"f_t{t_id}_p3_q{idx}.mp3")
            if not os.path.exists(fname_f):
                comm = edge_tts.Communicate(q, VOICE_FEMALE)
                await comm.save(fname_f)
                print(f"Generated f_t{t_id}_p3_q{idx}.mp3")

    print("ALL MALE AND FEMALE AUDIO GENERATED SUCCESSFULLY!")

if __name__ == '__main__':
    asyncio.run(generate())
