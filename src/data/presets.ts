import { PresetTopic } from '../types';

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: 'mnn-l15-permission',
    title: 'Lesson 15: 〜てもいいです / 〜てはいけません',
    level: 'N5',
    textbook: 'Minna no Nihongo L15',
    grammarPoint: 'V-て形 + もいいです / は行けません',
    meaning: 'Asking and giving/prohibiting permission (Can I...? / You must not...)',
    description: 'Essential classroom and daily rule grammar. Ideal for 50-60 min communicative practice.',
    defaultPlan: {
      id: 'preset-' + Math.random().toString(36).substr(2, 9),
      classId: '',
      date: new Date().toISOString().split('T')[0],
      teacherId: 'fidele',
      sessionType: 'hybride',
      targetedSkills: [],
      materials: [],
      manuals: [],
      objectives: [],
      prerequisites: '',
      prerequisitesChecked: false,
      homeworks: [],
      evaluations: [],
      attachments: [],
      hiddenSections: [],
      title: 'Asking & Prohibiting Permission (〜てもいいです・〜てはいけません)',
      targetLevel: 'N5',
      textbookRef: 'Minna no Nihongo Lesson 15',
      totalDurationMinutes: 50,
      grammarPoint: 'V-て形 + もいいです / V-て形 + は行けません',
      grammarPointMeaning: 'May I do [V]? / You must not do [V]',
      targetVocab: ['写真（しゃしん）を撮（と）る', '煙草（たばこ）を吸（す）う', '携帯（けいたい）を使（つか）う', '靴（くつ）を脱（ぬ）ぐ', '入（はい）る'],
      targetKanji: ['入', '出', '写', '真'],
      phases: [
        {
          id: 'p1',
          type: 'presentation',
          title: 'Presentation (導入)',
          titleJa: '提示',
          durationMinutes: 10,
          objective: 'Introduce the concept of asking for permission using visual cues in an art museum context.',
          teacherAction: 'Show picture of museum with "No Flash" sign. T acts out taking photo: 「すみません、写真を撮ってもいいですか。」 T shows green check / red X cards.',
          studentAction: 'Observe context, listen to pronunciation, repeat target sentence after teacher.',
          materialsNeeded: ['Museum Sign Flashcards', 'Check/X Cards', 'Audio Prompt'],
          boardPlanNote: 'Write context sentence with color-coded -て form highlights.'
        },
        {
          id: 'p2',
          type: 'comprehension',
          title: 'Comprehension Check (理解確認)',
          titleJa: '理解確認',
          durationMinutes: 10,
          objective: 'Verify students understand the rule vs permission distinction before drilling.',
          teacherAction: 'Ask Concept Check Questions (CCQs). Show 4 scenario cards (Library, Hospital, Park, Train).',
          studentAction: 'Answer CCQs with 「いいです」 or 「いけません」. Form quick phrase reactions.',
          materialsNeeded: ['4 Scenario Cards'],
          conceptCheckQuestions: [
            'Q1: 病院（びょういん）で煙草を吸ってもいいですか？ (No -> 吸ってはいけません)',
            'Q2: 公園（こうえん）で写真を撮ってもいいですか？ (Yes -> 撮ってもいいです)',
            'Q3: Is 「てはいけません」 used for friendly requests or rules/prohibitions? (Rules/Prohibitions)'
          ]
        },
        {
          id: 'p3',
          type: 'practice',
          title: 'Practice (練習)',
          titleJa: '練習',
          durationMinutes: 15,
          objective: 'Form transformation and substitution drills converting dictionary verbs to -て形 + もいいです.',
          teacherAction: 'Conduct choral substitution drill. Say verb stem, prompt student pair transformation.',
          studentAction: 'Choral repetition -> Pair practice with verb flashcards. Prompt: 「入る」 -> 「入ってもいいですか」.',
          materialsNeeded: ['Verb Flashcards (10 items)', 'Pair Worksheet']
        },
        {
          id: 'p4',
          type: 'production',
          title: 'Production (運用)',
          titleJa: '運用',
          durationMinutes: 15,
          objective: 'Roleplay asking for house rules or classroom rules in pairs and present to class.',
          teacherAction: 'Assign roleplay scenarios (Visiting a Japanese friend\'s house / Staying at a Ryokan). Circulate and monitor STT (Student Talk Time).',
          studentAction: 'In pairs, ask 3 permission questions based on role card, write down answers, present 1 rule to the group.',
          materialsNeeded: ['Roleplay Scenario Cards (Ryokan / Homestay)']
        }
      ],
      boardPlan: {
        title: '【文型 (Grammar Pattern)】',
        grammarPattern: 'V-て形 + もいいです（か）／ は行けません',
        exampleSentenceJa: 'Q: ここで写真を撮ってもいいですか。 A: ええ、いいですよ。 / いいえ、撮ってはいけません。',
        exampleSentenceRomaji: 'Q: Koko de shashin o totte mo ii desu ka? A: Ee, ii desu yo. / Iie, totte wa ikemasen.',
        exampleSentenceEn: 'Q: May I take photos here? A: Yes, you may. / No, you must not.',
        notes: ['注意: 「〜てはいけません」は強い禁止 (Strong prohibition)', '目上の人には「〜てもいいですか」を丁寧に使います']
      },
      teacherNotes: 'Keep teacher presentation concise (max 10 mins) to ensure students get at least 30 mins of active speaking practice!'
    }
  },
  {
    id: 'mnn-l18-can-do',
    title: 'Lesson 18: 〜ことができます (Abilities & Skills)',
    level: 'N5',
    textbook: 'Minna no Nihongo L18',
    grammarPoint: 'V-辞書形 + ことができます / 趣味は V-辞書形こと です',
    meaning: 'Expressing ability/skills (I can do X) and hobbies',
    description: 'Dynamic conversational lesson for expressing personal talents, hobbies, and capabilities.',
    defaultPlan: {
      id: 'preset-' + Math.random().toString(36).substr(2, 9),
      classId: '',
      date: new Date().toISOString().split('T')[0],
      teacherId: 'fidele',
      sessionType: 'hybride',
      targetedSkills: [],
      materials: [],
      manuals: [],
      objectives: [],
      prerequisites: '',
      prerequisitesChecked: false,
      homeworks: [],
      evaluations: [],
      attachments: [],
      hiddenSections: [],
      title: 'Expressing Abilities & Hobbies (〜ことができます)',
      targetLevel: 'N5',
      textbookRef: 'Minna no Nihongo Lesson 18',
      totalDurationMinutes: 50,
      grammarPoint: 'V-辞書形 + ことができます',
      grammarPointMeaning: 'I can do [V] / Able to [V]',
      targetVocab: ['運転（うんてん）する', '泳（およ）ぐ', 'ピアノを弾（ひ）く', '漢字（かんじ）を書（か）く', '料理（りょうり）する'],
      targetKanji: ['私', '泳', '書', '車'],
      phases: [
        {
          id: 'p1',
          type: 'presentation',
          title: 'Presentation (導入)',
          titleJa: '提示',
          durationMinutes: 10,
          objective: 'Demonstrate abilities vs non-abilities with fun gestures or sport/hobby cards.',
          teacherAction: 'T shows piano card: 「私はピアノを弾くことができます。」 T shows skiing card: 「スキーをすることができません。」',
          studentAction: 'Observe contrast, infer dictionary form + ことができます structure.',
          materialsNeeded: ['Hobby/Talent Cards']
        },
        {
          id: 'p2',
          type: 'comprehension',
          title: 'Comprehension Check (理解確認)',
          titleJa: '理解確認',
          durationMinutes: 10,
          objective: 'Ensure verb forms are in dictionary form before ことができます.',
          teacherAction: 'Show verb cards in ます-form and ask students to convert and verify meaning.',
          studentAction: 'Convert ます-form to 辞書形 + ことができます quickly in teams.',
          materialsNeeded: ['Verb Transformation Board']
        },
        {
          id: 'p3',
          type: 'practice',
          title: 'Practice (練習)',
          titleJa: '練習',
          durationMinutes: 15,
          objective: 'Chain drill asking classmates what skills they possess.',
          teacherAction: 'Model chain drill: 「S1さん、漢字を100個書くことができますか。」',
          studentAction: 'Chain reaction speaking practice with 5 classmates.',
          materialsNeeded: ['Find Someone Who Worksheet']
        },
        {
          id: 'p4',
          type: 'production',
          title: 'Production (運用)',
          titleJa: '運用',
          durationMinutes: 15,
          objective: 'Job interview roleplay or Talent show interview.',
          teacherAction: 'Pair students up into Interviewer & Candidate. Provide job description cards.',
          studentAction: 'Conduct 3-minute interview asking about 3 special skills required for the job.',
          materialsNeeded: ['Job Profile Role Cards']
        }
      ],
      boardPlan: {
        title: '【文型 (Grammar Pattern)】',
        grammarPattern: 'V-辞書形（Dictionary Form） + ことができます',
        exampleSentenceJa: '私は日本語で電話をかけることができます。',
        exampleSentenceRomaji: 'Watashi wa Nihongo de denwa o kakeru koto ga dekimasu.',
        exampleSentenceEn: 'I can make phone calls in Japanese.',
        notes: ['名詞（N）の場合は: N ができます (e.g. スキーができます)']
      },
      teacherNotes: 'Focus on fluid conversion from ます-form to dictionary form.'
    }
  },
  {
    id: 'jlpt-n4-advice',
    title: 'N4: 〜ほうがいいです (Giving Advice)',
    level: 'N4',
    textbook: 'Genki II / Minna L32',
    grammarPoint: 'V-た形 / V-ない形 + ほうがいいです',
    meaning: 'Giving advice or suggestions (It is better to / You had better)',
    description: 'Empathetic conversation practice where students give advice for health or travel problems.',
    defaultPlan: {
      id: 'preset-' + Math.random().toString(36).substr(2, 9),
      classId: '',
      date: new Date().toISOString().split('T')[0],
      teacherId: 'fidele',
      sessionType: 'hybride',
      targetedSkills: [],
      materials: [],
      manuals: [],
      objectives: [],
      prerequisites: '',
      prerequisitesChecked: false,
      homeworks: [],
      evaluations: [],
      attachments: [],
      hiddenSections: [],
      title: 'Giving Health & Travel Advice (〜ほうがいいです)',
      targetLevel: 'N4',
      textbookRef: 'Minna no Nihongo L32 / Genki II L19',
      totalDurationMinutes: 50,
      grammarPoint: 'V-た形 ほうがいいです / V-ない形 ほうがいいです',
      grammarPointMeaning: 'You had better do [V] / You had better not do [V]',
      targetVocab: ['熱（ねつ）がある', '薬（くすり）を飲（の）む', '無理（むり）をする', '休（やす）む', '医者（いしゃ）に行く'],
      targetKanji: ['熱', '薬', '病', '院'],
      phases: [
        {
          id: 'p1',
          type: 'presentation',
          title: 'Presentation (導入)',
          titleJa: '提示',
          durationMinutes: 10,
          objective: 'Present problem-solution scenarios (e.g. fever, lost wallet).',
          teacherAction: 'T acts out cough/fever: 「熱があります。どうしたらいいですか。」 T: 「温かいお茶を飲んだほうがいいです。」',
          studentAction: 'Recognize た-form usage for positive advice and ない-form for negative advice.',
          materialsNeeded: ['Symptom / Problem Flashcards']
        },
        {
          id: 'p2',
          type: 'comprehension',
          title: 'Comprehension Check (理解確認)',
          titleJa: '理解確認',
          durationMinutes: 10,
          objective: 'Check understanding that た-form is used for positive advice, NOT ます-form.',
          teacherAction: 'Check CCQ: 「行きます ほうがいい」 is correct? (No, 行った ほうがいい).',
          studentAction: 'Correct 5 deliberate mistakes on screen/board.',
          materialsNeeded: ['Grammar Correction Cards']
        },
        {
          id: 'p3',
          type: 'practice',
          title: 'Practice (練習)',
          titleJa: '練習',
          durationMinutes: 15,
          objective: 'Pair matching problems with appropriate Japanese advice.',
          teacherAction: 'Distribute problem cards (Cold, Lost in Tokyo, Sleepy during class).',
          studentAction: 'Match cards and speak out advice using 〜ほうがいいです.',
          materialsNeeded: ['Problem & Advice Card Matching Set']
        },
        {
          id: 'p4',
          type: 'production',
          title: 'Production (運用)',
          titleJa: '運用',
          durationMinutes: 15,
          objective: 'Agony Aunt / Advice Clinic roleplay.',
          teacherAction: 'Assign Student A as troubled traveler/patient and Student B as doctor/advisor.',
          studentAction: 'Student A describes 2 problems, Student B recommends 3 tailored pieces of advice.',
          materialsNeeded: ['Doctor & Patient Consultation Worksheets']
        }
      ],
      boardPlan: {
        title: '【文型 (Grammar Pattern)】',
        grammarPattern: 'V-た形 ＋ ほうがいいです（Advice to do） / V-ない形 ＋ ほうがいいです（Advice NOT to do）',
        exampleSentenceJa: 'Q: 頭が痛いです。 A: 早く寝たほうがいいですよ。お酒は飲まないほうがいいです。',
        exampleSentenceRomaji: 'Q: Atama ga itai desu. A: Hayaku neta hou ga ii desu yo. Osake wa nomanai hou ga ii desu.',
        exampleSentenceEn: 'Q: I have a headache. A: You had better go to sleep early. You had better not drink alcohol.',
        notes: ['「〜たらどうですか」よりも強いアドバイス (Stronger nuance than ~tara dou desu ka)']
      },
      teacherNotes: 'Emphasize empathetic tone and proper た-form conjugation.'
    }
  }
];
