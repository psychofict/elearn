import React, { useState, useMemo } from 'react';
import {
  BookOpen, Users, TrendingUp, Award, Clock, Play, User, Home,
  Library, BarChart3, Settings, Menu, X, Search, ArrowLeft,
  CheckCircle, ChevronRight, GraduationCap, Target, Flame, Bell, Type
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Subject, Lesson, SubjectsByLevel, UserProgress, UserSettings, Activity } from '../types';

// ===== COURSE DATA =====
const SUBJECTS: SubjectsByLevel = {
  'ZIMSEC O Level': [
    {
      id: 'o-math', name: 'Mathematics', totalLessons: 8,
      lessons: [
        { id: 'o-math-1', title: 'Number Systems & Operations', duration: '25 min', content: ['The number system forms the foundation of all mathematics. In this lesson, we explore natural numbers (1, 2, 3...), whole numbers (0, 1, 2...), integers (...-2, -1, 0, 1, 2...), rational numbers (fractions and terminating/recurring decimals), and irrational numbers (like √2 and π).', 'Understanding how to classify numbers and perform operations with them—addition, subtraction, multiplication, and division—is essential for all further mathematical study. We also cover order of operations (BODMAS/PEMDAS) and working with negative numbers.'], objectives: ['Classify numbers into natural, whole, integer, rational, and irrational sets', 'Apply order of operations correctly', 'Perform arithmetic with negative numbers'] },
        { id: 'o-math-2', title: 'Algebraic Expressions', duration: '30 min', content: ['Algebra uses letters and symbols to represent numbers and quantities in formulae and equations. An algebraic expression combines variables, constants, and operations.', 'Key skills include simplifying expressions by collecting like terms, expanding brackets using the distributive law, and factorising expressions. For example, 3x + 2x = 5x (collecting like terms), and 2(x + 3) = 2x + 6 (expanding).'], objectives: ['Simplify algebraic expressions', 'Expand and factorise brackets', 'Substitute values into expressions'] },
        { id: 'o-math-3', title: 'Linear Equations', duration: '25 min', content: ['A linear equation is an equation where the highest power of the variable is 1. Solving linear equations means finding the value of the unknown that makes the equation true.', 'To solve equations, use inverse operations to isolate the variable. For example, to solve 3x + 5 = 20: subtract 5 from both sides (3x = 15), then divide both sides by 3 (x = 5). Always check your answer by substituting back.'], objectives: ['Solve linear equations with one variable', 'Solve equations with brackets and fractions', 'Form and solve equations from word problems'] },
        { id: 'o-math-4', title: 'Quadratic Equations', duration: '35 min', content: ['A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0. There are three main methods for solving quadratics: factorisation, completing the square, and the quadratic formula.', 'Factorisation: Find two numbers that multiply to give ac and add to give b. For x² + 5x + 6 = 0, we get (x + 2)(x + 3) = 0, so x = -2 or x = -3. The quadratic formula x = (-b ± √(b²-4ac)) / 2a works for all quadratics.'], objectives: ['Solve quadratics by factorisation', 'Use the quadratic formula', 'Interpret solutions in context'] },
        { id: 'o-math-5', title: 'Geometry: Angles & Shapes', duration: '30 min', content: ['Geometry deals with shapes, sizes, and properties of figures. Key angle facts include: angles on a straight line sum to 180°, angles at a point sum to 360°, vertically opposite angles are equal, and angles in a triangle sum to 180°.', 'Properties of quadrilaterals: parallelograms have opposite sides equal and parallel; rectangles have all angles 90°; rhombuses have all sides equal; squares combine rectangle and rhombus properties. Knowing these properties helps solve problems involving unknown angles and sides.'], objectives: ['Apply angle properties to find unknown angles', 'Identify and use properties of triangles and quadrilaterals', 'Solve geometric problems using reasoning'] },
        { id: 'o-math-6', title: 'Statistics & Data Handling', duration: '25 min', content: ['Statistics involves collecting, organising, analysing, and interpreting data. Key measures of central tendency are the mean (sum ÷ count), median (middle value when ordered), and mode (most frequent value).', 'Data can be represented using bar charts, pie charts, histograms, and frequency polygons. For grouped data, we use the modal class and estimated mean. Understanding how to read and construct these representations is vital for interpreting real-world data.'], objectives: ['Calculate mean, median, and mode', 'Construct and interpret statistical diagrams', 'Analyse grouped frequency data'] },
        { id: 'o-math-7', title: 'Trigonometry', duration: '35 min', content: ['Trigonometry deals with relationships between angles and sides of triangles. The three primary ratios are: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, and tan(θ) = opposite/adjacent (SOH-CAH-TOA).', 'To find an unknown side: identify the ratio that links the known angle and side to the unknown side. To find an unknown angle: use the inverse function (sin⁻¹, cos⁻¹, or tan⁻¹). These skills are essential in surveying, construction, and engineering.'], objectives: ['Identify opposite, adjacent, and hypotenuse sides', 'Use sin, cos, and tan to find unknown sides', 'Use inverse trig to find unknown angles'] },
        { id: 'o-math-8', title: 'Probability', duration: '25 min', content: ['Probability measures the likelihood of an event occurring, on a scale from 0 (impossible) to 1 (certain). P(event) = number of favourable outcomes / total number of outcomes.', 'Combined events use the addition rule (for "or": P(A or B) = P(A) + P(B) - P(A and B)) and multiplication rule (for independent events: P(A and B) = P(A) × P(B)). Tree diagrams and sample space diagrams help visualise all possible outcomes.'], objectives: ['Calculate simple probabilities', 'Use tree diagrams for combined events', 'Apply addition and multiplication rules'] },
      ]
    },
    {
      id: 'o-eng', name: 'English Language', totalLessons: 6,
      lessons: [
        { id: 'o-eng-1', title: 'Essay Writing Techniques', duration: '30 min', content: ['A well-structured essay has three parts: introduction, body paragraphs, and conclusion. The introduction should hook the reader and state your thesis. Each body paragraph should focus on one main point with supporting evidence.', 'Use transition words (however, furthermore, consequently) to link ideas. Vary your sentence structures—mix short, punchy sentences with longer, more complex ones for rhythm and engagement.'], objectives: ['Structure an essay effectively', 'Write compelling introductions and conclusions', 'Use transitions and varied sentence structures'] },
        { id: 'o-eng-2', title: 'Comprehension Skills', duration: '25 min', content: ['Reading comprehension requires active engagement with the text. Before reading in detail, scan the passage to get a general idea. Then read carefully, noting key points and the author\'s purpose.', 'When answering questions: look for evidence in the text, quote directly where appropriate, and ensure your answers are in your own words unless asked to quote. Pay attention to command words like "explain," "describe," and "compare."'], objectives: ['Extract key information from passages', 'Identify author purpose and tone', 'Answer comprehension questions accurately'] },
        { id: 'o-eng-3', title: 'Grammar & Sentence Construction', duration: '25 min', content: ['Correct grammar is essential for clear communication. Key areas include subject-verb agreement (The dog runs, not The dog run), correct tense usage (past, present, future and their continuous/perfect forms), and proper pronoun reference.', 'Common errors to avoid: sentence fragments (incomplete sentences), run-on sentences (two complete sentences joined without proper punctuation), and dangling modifiers (misplaced descriptive phrases).'], objectives: ['Apply subject-verb agreement rules', 'Use tenses correctly and consistently', 'Identify and correct common grammatical errors'] },
        { id: 'o-eng-4', title: 'Creative Writing', duration: '35 min', content: ['Creative writing brings ideas to life through vivid descriptions, engaging characters, and compelling plots. Use sensory details—sight, sound, smell, taste, touch—to immerse the reader in your story.', 'Show, don\'t tell: instead of "She was angry," write "Her fists clenched, knuckles white, as she slammed the door behind her." Create tension through conflict, pacing, and suspense. Every good story needs a clear beginning, rising action, climax, and resolution.'], objectives: ['Use sensory details effectively', 'Create engaging characters and dialogue', 'Structure a narrative with tension and resolution'] },
        { id: 'o-eng-5', title: 'Letter Writing & Formal Communication', duration: '25 min', content: ['Formal letters follow a specific format: sender\'s address (top right), date, recipient\'s address (left), salutation (Dear Sir/Madam), body paragraphs, complimentary close (Yours faithfully/sincerely), and signature.', 'Use formal language—avoid contractions (write "do not" instead of "don\'t"), slang, and colloquialisms. Be clear, concise, and polite. State your purpose in the first paragraph and provide supporting details in subsequent paragraphs.'], objectives: ['Format formal and informal letters correctly', 'Use appropriate register and tone', 'Communicate clearly and concisely'] },
        { id: 'o-eng-6', title: 'Summary Writing', duration: '20 min', content: ['A summary condenses a longer text into its essential points. Read the original carefully, identify the main ideas (usually one per paragraph), and rewrite them in your own words.', 'A good summary is typically one-third the length of the original. Do not include your opinions or minor details. Use linking words to ensure your summary flows logically. Practice identifying topic sentences—they usually appear at the beginning of paragraphs.'], objectives: ['Identify main ideas in a passage', 'Write concise summaries in own words', 'Maintain logical flow without adding opinions'] },
      ]
    },
    {
      id: 'o-sci', name: 'Combined Science', totalLessons: 8,
      lessons: [
        { id: 'o-sci-1', title: 'Cells & Organisation', duration: '30 min', content: ['All living things are made of cells. Plant cells have a cell wall, chloroplasts, and a large vacuole in addition to the organelles found in animal cells (nucleus, cell membrane, cytoplasm, mitochondria, ribosomes).', 'Cells are organised into tissues (groups of similar cells), organs (groups of tissues working together), organ systems, and organisms. For example, muscle cells form muscle tissue, which forms the heart (organ), which is part of the circulatory system.'], objectives: ['Compare plant and animal cells', 'Describe the function of cell organelles', 'Explain levels of organisation in organisms'] },
        { id: 'o-sci-2', title: 'Chemical Bonding', duration: '30 min', content: ['Atoms bond to achieve a stable electron configuration (full outer shell). Ionic bonding involves the transfer of electrons from metals to non-metals, forming charged ions that attract each other. For example, NaCl: Na loses one electron to become Na⁺, Cl gains it to become Cl⁻.', 'Covalent bonding involves sharing electron pairs between non-metal atoms. For example, in water (H₂O), oxygen shares electrons with two hydrogen atoms. Metallic bonding involves a lattice of positive ions surrounded by delocalised electrons.'], objectives: ['Explain ionic, covalent, and metallic bonding', 'Draw dot-and-cross diagrams', 'Relate bonding to properties of substances'] },
        { id: 'o-sci-3', title: 'Forces & Motion', duration: '25 min', content: ['A force is a push or pull measured in Newtons (N). Forces can change the speed, direction, or shape of an object. Balanced forces result in no change in motion; unbalanced forces cause acceleration.', 'Newton\'s laws: (1) An object remains at rest or in uniform motion unless acted on by a resultant force. (2) F = ma (force equals mass times acceleration). (3) Every action has an equal and opposite reaction. Speed = distance/time, and velocity includes direction.'], objectives: ['Calculate speed, velocity, and acceleration', 'Apply Newton\'s laws to real scenarios', 'Analyse force diagrams'] },
        { id: 'o-sci-4', title: 'Photosynthesis & Respiration', duration: '30 min', content: ['Photosynthesis is the process by which green plants make food: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (using light energy and chlorophyll). It occurs in the chloroplasts. Factors affecting the rate include light intensity, CO₂ concentration, and temperature.', 'Respiration releases energy from glucose: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (aerobic) or C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + less energy (anaerobic in yeast). Respiration occurs in mitochondria and is essential for all life processes.'], objectives: ['Write and balance photosynthesis and respiration equations', 'Describe factors affecting photosynthesis rate', 'Compare aerobic and anaerobic respiration'] },
        { id: 'o-sci-5', title: 'Electricity & Circuits', duration: '30 min', content: ['Electric current is the flow of charge (electrons) through a conductor, measured in amperes (A). Voltage (V) is the energy per unit charge that drives the current. Resistance (Ω) opposes current flow.', 'Ohm\'s law: V = IR. In series circuits, current is the same throughout and voltages add up. In parallel circuits, voltage is the same across each branch and currents add up. Components include resistors, bulbs, switches, and ammeters/voltmeters.'], objectives: ['Apply Ohm\'s law to calculate V, I, and R', 'Distinguish series and parallel circuits', 'Draw and interpret circuit diagrams'] },
        { id: 'o-sci-6', title: 'The Periodic Table', duration: '25 min', content: ['The periodic table arranges elements by atomic number (number of protons). Elements in the same group have similar properties because they have the same number of outer shell electrons. Periods represent energy levels.', 'Group 1 (alkali metals) are soft, reactive metals that react vigorously with water. Group 7 (halogens) are reactive non-metals. Group 0 (noble gases) are unreactive due to full outer shells. Metals are found on the left; non-metals on the right.'], objectives: ['Explain the structure of the periodic table', 'Predict element properties from group and period', 'Describe trends across periods and down groups'] },
        { id: 'o-sci-7', title: 'Ecosystems & Environment', duration: '25 min', content: ['An ecosystem consists of all living organisms (biotic factors) and their non-living environment (abiotic factors) interacting in a specific area. Food chains show energy flow: producer → primary consumer → secondary consumer → tertiary consumer.', 'Biodiversity is the variety of living organisms in an ecosystem. Human activities like deforestation, pollution, and overgrazing threaten ecosystems. Conservation efforts include national parks, seed banks, and sustainable farming practices relevant to Zimbabwe\'s context.'], objectives: ['Describe components of an ecosystem', 'Construct and interpret food chains and webs', 'Discuss human impacts on ecosystems and conservation'] },
        { id: 'o-sci-8', title: 'Acids, Bases & Salts', duration: '25 min', content: ['Acids produce H⁺ ions in solution (pH < 7), bases/alkalis produce OH⁻ ions (pH > 7). The pH scale runs from 0 (strongly acidic) to 14 (strongly alkaline), with 7 being neutral.', 'Neutralisation: acid + base → salt + water. For example, HCl + NaOH → NaCl + H₂O. Acids react with metals to produce salt + hydrogen, and with carbonates to produce salt + water + CO₂. Indicators like litmus and universal indicator show pH.'], objectives: ['Define acids and bases using the pH scale', 'Write neutralisation equations', 'Describe reactions of acids with metals and carbonates'] },
      ]
    },
    {
      id: 'o-hist', name: 'History', totalLessons: 6,
      lessons: [
        { id: 'o-hist-1', title: 'Pre-Colonial Zimbabwe', duration: '30 min', content: ['The Great Zimbabwe civilisation (11th-15th century) was a major trading centre and one of the most impressive stone structures in Africa. It was the capital of the Kingdom of Zimbabwe and served as a centre for gold and ivory trade.', 'Other significant pre-colonial states include the Mutapa Empire (Munhumutapa), the Rozvi Empire, and the Ndebele State under Mzilikazi and later Lobengula. These societies had complex political, social, and economic systems.'], objectives: ['Describe the significance of Great Zimbabwe', 'Explain the political systems of pre-colonial states', 'Analyse trade networks in southern Africa'] },
        { id: 'o-hist-2', title: 'Colonial Period & the Rudd Concession', duration: '30 min', content: ['The colonial period began with Cecil Rhodes and the British South Africa Company. The Rudd Concession (1888) tricked Lobengula into granting mineral rights, leading to the occupation of Mashonaland in 1890.', 'The Pioneer Column established Fort Salisbury (now Harare). Land was systematically taken from indigenous people through various ordinances. The two Chimurenga wars (1896-97 and 1966-79) were resistance movements against colonial rule.'], objectives: ['Explain the circumstances of the Rudd Concession', 'Describe the establishment of colonial rule', 'Analyse the causes and effects of the First Chimurenga'] },
        { id: 'o-hist-3', title: 'The Federation Period (1953-1963)', duration: '25 min', content: ['The Federation of Rhodesia and Nyasaland (Central African Federation) united Southern Rhodesia, Northern Rhodesia, and Nyasaland under a single government. It was largely promoted by white settlers seeking economic advantages.', 'African nationalists opposed the Federation, seeing it as a way to extend white minority rule. Key figures like Joshua Nkomo and Kenneth Kaunda led opposition. The Federation dissolved in 1963 due to African opposition and political pressure.'], objectives: ['Explain the formation and structure of the Federation', 'Describe African opposition to the Federation', 'Analyse reasons for the dissolution of the Federation'] },
        { id: 'o-hist-4', title: 'UDI & the Liberation Struggle', duration: '35 min', content: ['Ian Smith\'s Rhodesian Front declared Unilateral Declaration of Independence (UDI) on 11 November 1965 to maintain white minority rule. International sanctions were imposed but largely ineffective due to support from South Africa and Portugal.', 'The Second Chimurenga (liberation war) was fought primarily by ZANLA (led by Robert Mugabe) and ZIPRA (led by Joshua Nkomo). The war and diplomatic pressure led to the Lancaster House Agreement (1979) and elections in 1980 that brought independence.'], objectives: ['Explain the causes and consequences of UDI', 'Describe the role of liberation movements', 'Analyse the path to the Lancaster House Agreement'] },
        { id: 'o-hist-5', title: 'Independence & Nation Building', duration: '25 min', content: ['Zimbabwe gained independence on 18 April 1980 with Robert Mugabe as Prime Minister. The new government inherited a racially divided society and economy. Reconciliation was promoted through the policy of national unity.', 'Key developments included expansion of education and healthcare, the Unity Accord of 1987, and the land reform programme. Understanding these events helps us appreciate the challenges and achievements of nation-building.'], objectives: ['Describe the transition to independence', 'Explain key policies of the new government', 'Analyse challenges of nation building'] },
        { id: 'o-hist-6', title: 'World Wars & Their Impact on Africa', duration: '30 min', content: ['Both World War I (1914-1918) and World War II (1939-1945) had significant impacts on Africa. African soldiers fought in both wars, gaining military experience and exposure to ideas of freedom and self-determination.', 'The aftermath of WWII accelerated decolonisation across Africa. The Atlantic Charter, formation of the UN, and weakening of European powers created conditions for independence movements. Pan-Africanism grew as a unifying ideology.'], objectives: ['Describe African participation in the World Wars', 'Explain how the wars affected colonial rule', 'Link post-war developments to independence movements'] },
      ]
    },
    {
      id: 'o-geo', name: 'Geography', totalLessons: 6,
      lessons: [
        { id: 'o-geo-1', title: 'Map Reading & Interpretation', duration: '30 min', content: ['Maps represent the earth\'s surface on a flat plane. Key elements include scale (ratio of map distance to actual distance), direction (using a compass rose or grid north), and symbols (conventional signs representing features).', 'Contour lines connect points of equal height above sea level. Close contours indicate steep slopes; widely spaced contours indicate gentle slopes. Grid references (4-figure and 6-figure) help locate specific points on a map.'], objectives: ['Calculate distances using map scales', 'Interpret contour lines and relief', 'Give accurate grid references'] },
        { id: 'o-geo-2', title: 'Weather & Climate of Zimbabwe', duration: '25 min', content: ['Zimbabwe has a subtropical climate with three seasons: hot wet season (November-March), cool dry season (April-July), and hot dry season (August-October). Altitude significantly affects temperatures—the Eastern Highlands are cooler than the Lowveld.', 'Rainfall varies from over 1000mm in the Eastern Highlands to below 400mm in the Lowveld. The Inter-Tropical Convergence Zone (ITCZ) brings the rainy season. Understanding weather patterns is crucial for agriculture and water management.'], objectives: ['Describe Zimbabwe\'s climate zones', 'Explain factors affecting temperature and rainfall', 'Interpret weather maps and climate data'] },
        { id: 'o-geo-3', title: 'Agriculture in Zimbabwe', duration: '30 min', content: ['Agriculture is a key sector of Zimbabwe\'s economy, employing a significant portion of the population. Major crops include maize (the staple food), tobacco, cotton, wheat, and sugar cane. Livestock farming focuses on cattle, goats, and poultry.', 'Challenges include erratic rainfall, land degradation, and limited access to inputs. Irrigation schemes (like those at Lowveld sugar estates) help extend the growing season. Subsistence farming dominates rural areas while commercial farming targets export markets.'], objectives: ['Identify major crops and farming regions', 'Explain challenges facing Zimbabwean agriculture', 'Compare subsistence and commercial farming'] },
        { id: 'o-geo-4', title: 'Population & Settlement', duration: '25 min', content: ['Population geography studies the distribution, density, and growth of human populations. Zimbabwe\'s population is unevenly distributed—concentrated in the Highveld and major cities (Harare, Bulawayo) due to better climate, soils, and economic opportunities.', 'Urbanisation is increasing as people migrate from rural to urban areas seeking employment and services. This creates challenges including housing shortages, traffic congestion, and strain on services. Settlement patterns reflect historical, economic, and environmental factors.'], objectives: ['Analyse population distribution patterns', 'Explain causes and effects of urbanisation', 'Interpret population pyramids and demographic data'] },
        { id: 'o-geo-5', title: 'Rivers & Water Resources', duration: '25 min', content: ['Zimbabwe\'s major rivers include the Zambezi (northern border), Limpopo (southern border), Save, and Shangani. River processes include erosion (wearing away), transportation (carrying material), and deposition (dropping material).', 'Features formed include V-shaped valleys (upper course), meanders and flood plains (middle course), and deltas (lower course). Water is essential for domestic use, agriculture, industry, and hydroelectric power (Kariba Dam). Water management and conservation are critical issues.'], objectives: ['Describe river processes and features', 'Identify Zimbabwe\'s major rivers and their importance', 'Discuss water management challenges'] },
        { id: 'o-geo-6', title: 'Mining & Industry', duration: '25 min', content: ['Zimbabwe is rich in minerals including gold, platinum, chrome, diamonds, and lithium. The Great Dyke is a major geological feature rich in chrome and platinum. Mining contributes significantly to exports and employment.', 'Industries include manufacturing (food processing, textiles), construction, and services. Industrial location factors include raw materials, transport, labour, power, and markets. The growth of the mining sector, particularly in lithium, presents new economic opportunities.'], objectives: ['Identify major mineral resources and their locations', 'Explain factors affecting industrial location', 'Analyse the economic importance of mining'] },
      ]
    },
    {
      id: 'o-acc', name: 'Accounting', totalLessons: 5,
      lessons: [
        { id: 'o-acc-1', title: 'Introduction to Accounting', duration: '25 min', content: ['Accounting is the process of recording, summarising, and reporting financial transactions. The accounting equation is: Assets = Liabilities + Owner\'s Equity. Every transaction affects at least two accounts (double-entry bookkeeping).', 'Source documents include receipts, invoices, and bank statements. These provide evidence of transactions and are the starting point for recording in books of original entry (journals, cash books).'], objectives: ['State and apply the accounting equation', 'Identify source documents', 'Understand the role of accounting in business'] },
        { id: 'o-acc-2', title: 'Double-Entry Bookkeeping', duration: '30 min', content: ['Every transaction is recorded twice: as a debit in one account and a credit in another. Debits increase assets and expenses; credits increase liabilities, owner\'s equity, and revenue.', 'T-accounts help visualise entries. For example, when the owner invests $1000 cash: debit Cash (asset increases), credit Capital (owner\'s equity increases). The trial balance checks that total debits equal total credits.'], objectives: ['Apply debit and credit rules correctly', 'Record transactions in T-accounts', 'Prepare a trial balance'] },
        { id: 'o-acc-3', title: 'Trading & Profit and Loss Account', duration: '30 min', content: ['The Trading Account calculates Gross Profit: Sales - Cost of Goods Sold (opening stock + purchases - closing stock). The Profit and Loss Account then deducts operating expenses from Gross Profit to find Net Profit.', 'Revenue includes sales, commission received, and interest earned. Expenses include rent, salaries, insurance, and depreciation. Proper classification ensures accurate financial reporting.'], objectives: ['Calculate cost of goods sold and gross profit', 'Prepare a trading and profit and loss account', 'Distinguish between revenue and capital items'] },
        { id: 'o-acc-4', title: 'Balance Sheet', duration: '25 min', content: ['The balance sheet shows a business\'s financial position at a specific date. It lists non-current assets (land, equipment), current assets (cash, stock, debtors), current liabilities (creditors, bank overdraft), and long-term liabilities (loans).', 'Working capital = Current Assets - Current Liabilities. A healthy working capital means the business can meet short-term obligations. Net assets should equal the owner\'s equity (Capital + Net Profit - Drawings).'], objectives: ['Classify assets and liabilities correctly', 'Prepare a balance sheet', 'Calculate and interpret working capital'] },
        { id: 'o-acc-5', title: 'Bank Reconciliation', duration: '25 min', content: ['The bank reconciliation statement explains differences between the cash book balance and the bank statement balance. Differences arise from unpresented cheques, outstanding deposits, bank charges, and direct credits/debits.', 'Process: Start with the cash book balance, adjust for items in the bank statement not yet in the cash book. Then start with the bank statement balance and adjust for items in the cash book not yet on the bank statement. Both adjusted balances should agree.'], objectives: ['Identify causes of differences between cash book and bank statement', 'Update the cash book for bank statement items', 'Prepare a bank reconciliation statement'] },
      ]
    },
    {
      id: 'o-bus', name: 'Business Studies', totalLessons: 5,
      lessons: [
        { id: 'o-bus-1', title: 'Types of Business Organisations', duration: '25 min', content: ['Businesses can be organised as sole traders (one owner, unlimited liability), partnerships (2-20 partners sharing profits and liability), private limited companies (Ltd), and public limited companies (PLC).', 'Key differences include liability (limited vs unlimited), sources of finance, continuity, and decision-making. In Zimbabwe, many SMEs operate as sole traders or partnerships. Companies must register and comply with the Companies Act.'], objectives: ['Compare different forms of business ownership', 'Explain limited and unlimited liability', 'Identify advantages and disadvantages of each type'] },
        { id: 'o-bus-2', title: 'Marketing', duration: '25 min', content: ['Marketing is the process of identifying and satisfying customer needs profitably. The marketing mix (4Ps) consists of Product (what you sell), Price (how much you charge), Place (where you sell), and Promotion (how you communicate).', 'Market research (surveys, questionnaires, observation) helps businesses understand their customers. Market segmentation divides the market into groups based on age, income, location, etc. This allows targeted marketing strategies.'], objectives: ['Explain the marketing mix (4Ps)', 'Describe methods of market research', 'Understand market segmentation and targeting'] },
        { id: 'o-bus-3', title: 'Human Resources', duration: '25 min', content: ['Human resource management covers recruitment, selection, training, motivation, and employee welfare. Recruitment can be internal (promoting existing staff) or external (advertising to new candidates).', 'Motivation theories include Maslow\'s hierarchy of needs (physiological, safety, social, esteem, self-actualisation) and Herzberg\'s two-factor theory (hygiene factors and motivators). Motivated employees are more productive and loyal.'], objectives: ['Describe the recruitment and selection process', 'Explain motivation theories and their application', 'Understand the importance of training and development'] },
        { id: 'o-bus-4', title: 'Finance & Cash Flow', duration: '30 min', content: ['Businesses need finance for start-up costs, working capital, and expansion. Internal sources include retained profits and sale of assets. External sources include bank loans, overdrafts, trade credit, and venture capital.', 'Cash flow forecasts predict money coming in and going out. A positive cash flow means more money coming in than going out. Cash flow problems can be managed by negotiating better payment terms, reducing costs, or increasing sales.'], objectives: ['Identify sources of business finance', 'Prepare and interpret cash flow forecasts', 'Suggest solutions to cash flow problems'] },
        { id: 'o-bus-5', title: 'Business Environment', duration: '25 min', content: ['Businesses operate within an external environment that includes economic factors (inflation, exchange rates), social factors (population changes, trends), technological factors (automation, digital platforms), and legal factors (regulations, labour laws).', 'Stakeholders include owners, employees, customers, suppliers, the community, and government. Each has different interests that may sometimes conflict. Successful businesses balance stakeholder needs while remaining profitable.'], objectives: ['Analyse external factors affecting business using PEST analysis', 'Identify business stakeholders and their interests', 'Explain how businesses respond to environmental changes'] },
      ]
    },
    {
      id: 'o-nde', name: 'Ndebele', totalLessons: 5,
      lessons: [
        { id: 'o-nde-1', title: 'Izibongo zesiNdebele (Noun Classes)', duration: '25 min', content: ['IsiNdebele silamaklasi amanengi amabizo. Iklasi ngayinye ilesiqalo sayo esitshengisa inani lebizo—noma linye kumbe amanengi. Isibonelo: um- (umu-ntu → umuntu; aba-ntu → abantu).', 'The Ndebele noun class system uses prefixes to indicate singular and plural forms. Understanding these classes is essential for correct grammar, as they determine the agreement patterns of adjectives, pronouns, and verbs in the sentence.'], objectives: ['Identify the main Ndebele noun classes', 'Form plurals correctly using class prefixes', 'Apply noun class agreement in sentences'] },
        { id: 'o-nde-2', title: 'Ukubhala Indaba (Narrative Writing)', duration: '30 min', content: ['Ukubhala indaba kumele kulandelane kuhle: isiqalo (introduction), umzimba (body), lesiphetho (conclusion). Sebenzisa izaga lezitsho ukuze indaba yakho ibe mnandi.', 'Good narrative writing in Ndebele requires vivid descriptions, proper character development, and cultural context. Use proverbs (izaga) and idioms (izitsho) to enrich your writing. The story should have a clear moral or lesson (isifundo).'], objectives: ['Structure a narrative composition correctly', 'Use izaga and izitsho appropriately', 'Create engaging characters and dialogue in isiNdebele'] },
        { id: 'o-nde-3', title: 'Inkondlo (Poetry)', duration: '25 min', content: ['Inkondlo zesiNdebele zisebenzisa izinto ezinengi zobuciko: umfanekisomqondo (imagery), ukufanisa (simile), isiphathomandla (personification), lokuphindaphinda (repetition).', 'Ndebele poetry has deep cultural roots, often celebrating heroes, nature, and communal values. Praise poetry (izibongo) is a significant oral tradition. When analysing poetry, consider the theme, tone, literary devices, and the poet\'s message.'], objectives: ['Identify literary devices in Ndebele poetry', 'Analyse themes and tone in inkondlo', 'Compose original poems using literary techniques'] },
        { id: 'o-nde-4', title: 'Ukuzwisisisa (Comprehension)', duration: '25 min', content: ['Ukuzwisisisa kufuna umuntu afunde ngokunanzelela. Qala ubale indatshana yonke, ubusubala futhi unakana imibuzo ngokunanzelela. Phendula ngamazwi akho, ungakhophi amazwi endatshana.', 'When approaching a Ndebele comprehension passage, read it twice—first for general understanding, then for specific details. Answer questions in full sentences, use your own words, and support your answers with evidence from the passage. Pay attention to command words.'], objectives: ['Extract information accurately from Ndebele texts', 'Answer comprehension questions in own words', 'Identify main ideas and supporting details'] },
        { id: 'o-nde-5', title: 'Inkulumo (Oral Communication)', duration: '20 min', content: ['Inkulumo enhle idinga ukuthi umuntu akhulume ngokucacileyo, ngesibindi, langokuzithemba. Sebenzisa imilolozelo, izaga, lamazwi anothando ukuxhumanisa labezwayo.', 'Effective oral communication in Ndebele involves clear pronunciation, appropriate tone and gestures, and cultural sensitivity. Practice speeches, debates, and discussions. Respect is shown through proper address forms (ukuhlonipha) and turn-taking in conversation.'], objectives: ['Deliver speeches with confidence and clarity', 'Use appropriate address forms and register', 'Participate effectively in discussions and debates'] },
      ]
    },
  ],
  'ZIMSEC A Level': [
    {
      id: 'a-math', name: 'Pure Mathematics', totalLessons: 6,
      lessons: [
        { id: 'a-math-1', title: 'Polynomials & Factor Theorem', duration: '35 min', content: ['A polynomial of degree n has the form aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀. The Factor Theorem states that (x - a) is a factor of f(x) if and only if f(a) = 0. The Remainder Theorem states that when f(x) is divided by (x - a), the remainder is f(a).', 'To factorise a cubic polynomial: try integer factors of the constant term using the Factor Theorem, then use polynomial division or synthetic division to find the remaining quadratic factor. This can then be factorised further or solved using the quadratic formula.'], objectives: ['Apply the Factor and Remainder Theorems', 'Factorise polynomials up to degree 3', 'Solve polynomial equations'] },
        { id: 'a-math-2', title: 'Coordinate Geometry', duration: '30 min', content: ['Advanced coordinate geometry covers the equation of a circle (x - a)² + (y - b)² = r² with centre (a, b) and radius r. The general form x² + y² + 2gx + 2fy + c = 0 has centre (-g, -f) and radius √(g² + f² - c).', 'Key skills include finding the equation of a tangent to a circle (perpendicular to the radius at the point of contact), determining whether a line intersects, is tangent to, or misses a circle (using the discriminant), and finding intersection points.'], objectives: ['Write and manipulate equations of circles', 'Find equations of tangents and normals', 'Solve problems involving lines and circles'] },
        { id: 'a-math-3', title: 'Calculus: Differentiation', duration: '40 min', content: ['Differentiation from first principles: f\'(x) = lim(h→0) [f(x+h) - f(x)]/h. For power functions: d/dx(xⁿ) = nxⁿ⁻¹. The chain rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x). The product rule: d/dx[uv] = u·dv/dx + v·du/dx. The quotient rule: d/dx[u/v] = (v·du/dx - u·dv/dx)/v².', 'Applications include finding gradients, equations of tangents and normals, stationary points (where dy/dx = 0), and determining their nature using the second derivative. In optimization problems, differentiation finds maximum and minimum values.'], objectives: ['Differentiate polynomials, products, quotients, and composite functions', 'Find and classify stationary points', 'Solve optimisation problems using calculus'] },
        { id: 'a-math-4', title: 'Calculus: Integration', duration: '35 min', content: ['Integration is the reverse of differentiation. ∫xⁿ dx = xⁿ⁺¹/(n+1) + C for n ≠ -1. Definite integrals ∫ₐᵇ f(x) dx give the signed area between the curve and the x-axis from x = a to x = b.', 'Integration techniques include substitution (for composite functions), integration by parts (∫u dv = uv - ∫v du), and partial fractions (for rational functions). Applications include finding areas between curves and volumes of revolution.'], objectives: ['Integrate standard functions', 'Use substitution and integration by parts', 'Calculate areas and volumes using integration'] },
        { id: 'a-math-5', title: 'Sequences & Series', duration: '30 min', content: ['An arithmetic sequence has common difference d: aₙ = a₁ + (n-1)d, sum Sₙ = n/2(2a + (n-1)d). A geometric sequence has common ratio r: aₙ = a₁rⁿ⁻¹, sum Sₙ = a(1-rⁿ)/(1-r).', 'For |r| < 1, a geometric series converges to S∞ = a/(1-r). The binomial theorem: (a+b)ⁿ = Σ(k=0 to n) C(n,k)aⁿ⁻ᵏbᵏ. The binomial expansion is useful for approximations when |x| < 1.'], objectives: ['Work with arithmetic and geometric sequences', 'Find sums of finite and infinite series', 'Apply the binomial theorem'] },
        { id: 'a-math-6', title: 'Trigonometric Identities & Equations', duration: '35 min', content: ['Key identities: sin²θ + cos²θ = 1, tan²θ + 1 = sec²θ, 1 + cot²θ = csc²θ. Addition formulae: sin(A±B) = sinAcosB ± cosAsinB, cos(A±B) = cosAcosB ∓ sinAsinB.', 'Double angle formulae: sin2A = 2sinAcosA, cos2A = cos²A - sin²A. These identities are used to solve equations like 2sin²x + sinx - 1 = 0 (substitute sinx = t, solve the quadratic) and to prove other identities.'], objectives: ['Prove trigonometric identities', 'Solve trigonometric equations in given intervals', 'Use addition and double angle formulae'] },
      ]
    },
    {
      id: 'a-phys', name: 'Physics', totalLessons: 6,
      lessons: [
        { id: 'a-phys-1', title: 'Mechanics: Kinematics', duration: '35 min', content: ['Kinematics describes motion without considering forces. Key equations (SUVAT): v = u + at, s = ut + ½at², v² = u² + 2as, s = ½(u+v)t. These apply to uniform acceleration in a straight line.', 'Projectile motion combines horizontal (constant velocity) and vertical (acceleration due to gravity) components independently. At the highest point, vertical velocity = 0. Time of flight, range, and maximum height can be calculated by resolving into components.'], objectives: ['Apply SUVAT equations to linear motion', 'Resolve projectile motion into components', 'Interpret displacement-time and velocity-time graphs'] },
        { id: 'a-phys-2', title: 'Waves & Optics', duration: '30 min', content: ['Waves transfer energy without transferring matter. Transverse waves (light, water) oscillate perpendicular to direction of travel; longitudinal waves (sound) oscillate parallel. v = fλ relates wave speed, frequency, and wavelength.', 'Interference occurs when waves superpose: constructive (in phase, amplitudes add) and destructive (antiphase, amplitudes cancel). Young\'s double-slit experiment demonstrates light interference, providing evidence for wave nature. Diffraction gratings: d sinθ = nλ.'], objectives: ['Describe properties of transverse and longitudinal waves', 'Explain interference and diffraction', 'Apply wave equations to solve problems'] },
        { id: 'a-phys-3', title: 'Electricity', duration: '35 min', content: ['Current I = ΔQ/Δt (charge flow per unit time). EMF (ε) is the energy per unit charge from a source. Internal resistance (r) causes the terminal PD to be less than EMF: V = ε - Ir.', 'Kirchhoff\'s laws: (1) Sum of currents at a junction = 0 (charge conservation). (2) Sum of EMFs = sum of PDs around any closed loop (energy conservation). Potential dividers split voltage in the ratio of resistances: V₁/V₂ = R₁/R₂.'], objectives: ['Apply Kirchhoff\'s laws to circuits', 'Analyse circuits with internal resistance', 'Design and analyse potential dividers'] },
        { id: 'a-phys-4', title: 'Quantum Physics', duration: '35 min', content: ['The photoelectric effect: light ejects electrons from metals only if frequency > threshold frequency f₀. Einstein\'s equation: hf = φ + ½mv²max, where φ = hf₀ is the work function. This shows light has particle nature (photons).', 'Wave-particle duality: electrons can show wave behaviour (electron diffraction). De Broglie wavelength: λ = h/p = h/(mv). Energy levels in atoms are quantised; photon energy E = hf corresponds to transitions between levels.'], objectives: ['Explain the photoelectric effect using photon theory', 'Calculate de Broglie wavelengths', 'Describe wave-particle duality and energy levels'] },
        { id: 'a-phys-5', title: 'Nuclear Physics', duration: '30 min', content: ['The nucleus contains protons and neutrons (nucleons) held by the strong nuclear force. Nuclear notation: ᴬ_Z X where A = mass number, Z = atomic number. Isotopes have same Z but different A.', 'Radioactive decay types: α (helium nucleus, stopped by paper), β⁻ (electron, stopped by aluminium), γ (electromagnetic, reduced by lead). Half-life t½ is the time for activity or number of nuclei to halve. N = N₀e^(-λt), where λ = ln2/t½.'], objectives: ['Describe nuclear structure and isotopes', 'Characterise types of radioactive decay', 'Apply half-life and decay equations'] },
        { id: 'a-phys-6', title: 'Fields: Gravitational & Electric', duration: '35 min', content: ['Gravitational field strength g = F/m = GM/r² (radial field). Gravitational potential V_g = -GM/r. Field lines point toward masses; equipotentials are perpendicular to field lines.', 'Electric field strength E = F/q = kQ/r² (radial) or E = V/d (uniform). Coulomb\'s law: F = kQ₁Q₂/r². Electric potential V_e = kQ/r. Similarities: both are inverse square law forces. Differences: gravity is always attractive; electric force can be attractive or repulsive.'], objectives: ['Calculate gravitational and electric field strengths', 'Compare gravitational and electric fields', 'Apply field equations to solve problems'] },
      ]
    },
    {
      id: 'a-chem', name: 'Chemistry', totalLessons: 6,
      lessons: [
        { id: 'a-chem-1', title: 'Atomic Structure & Periodicity', duration: '30 min', content: ['Electrons occupy orbitals (s, p, d, f) in order of increasing energy. The electron configuration determines chemical properties. For example, Na: 1s² 2s² 2p⁶ 3s¹. Ionisation energy is the energy to remove one mole of electrons from gaseous atoms.', 'First ionisation energy generally increases across a period (increasing nuclear charge) and decreases down a group (increasing shielding and distance). Anomalies occur at Groups 3 and 6 due to electron sub-shell structure.'], objectives: ['Write electron configurations using s, p, d notation', 'Explain trends in ionisation energy', 'Relate electronic structure to position in the periodic table'] },
        { id: 'a-chem-2', title: 'Chemical Energetics', duration: '35 min', content: ['Enthalpy change (ΔH) is the heat energy transferred at constant pressure. Exothermic reactions (ΔH < 0) release energy; endothermic reactions (ΔH > 0) absorb energy. Standard enthalpy changes are measured at 298K and 100kPa.', 'Hess\'s Law: the total enthalpy change is independent of the route taken. Bond enthalpy is the energy needed to break one mole of bonds in gaseous molecules. ΔH ≈ Σ(bonds broken) - Σ(bonds formed).'], objectives: ['Calculate enthalpy changes using Hess\'s Law', 'Use bond enthalpies to estimate ΔH', 'Interpret enthalpy profile diagrams'] },
        { id: 'a-chem-3', title: 'Organic Chemistry: Hydrocarbons', duration: '35 min', content: ['Alkanes (CₙH₂ₙ₊₂) are saturated hydrocarbons with single bonds only. They undergo substitution reactions with halogens (free radical mechanism: initiation, propagation, termination).', 'Alkenes (CₙH₂ₙ) have C=C double bonds and are unsaturated. They undergo addition reactions: hydrogenation (+ H₂), halogenation (+ Br₂—decolourises bromine water), hydration (+ H₂O with acid catalyst). Electrophilic addition mechanism involves the electron-rich double bond.'], objectives: ['Name and draw alkanes and alkenes', 'Describe and explain reaction mechanisms', 'Predict products of organic reactions'] },
        { id: 'a-chem-4', title: 'Chemical Equilibria', duration: '30 min', content: ['Dynamic equilibrium: forward and reverse reactions occur at equal rates; concentrations remain constant. Le Chatelier\'s principle: if conditions change, the equilibrium shifts to oppose the change.', 'The equilibrium constant Kc = [products]/[reactants] (raised to stoichiometric powers). A large Kc means products are favoured. Temperature changes alter Kc; concentration and pressure changes shift position but don\'t change Kc. Catalysts speed up both directions equally.'], objectives: ['Explain dynamic equilibrium', 'Apply Le Chatelier\'s principle', 'Calculate and interpret Kc values'] },
        { id: 'a-chem-5', title: 'Redox Chemistry', duration: '30 min', content: ['Oxidation is loss of electrons (increase in oxidation state); reduction is gain of electrons (decrease in oxidation state). OIL RIG: Oxidation Is Loss, Reduction Is Gain.', 'Oxidation states follow rules: elements = 0, O usually = -2, H usually = +1, sum in compound = 0, sum in ion = charge. Half-equations balance atoms, then electrons. Electrochemical cells convert chemical energy to electrical energy. Standard electrode potential E° indicates tendency to be reduced.'], objectives: ['Assign oxidation states', 'Write and balance half-equations', 'Predict feasibility of reactions using E° values'] },
        { id: 'a-chem-6', title: 'Reaction Kinetics', duration: '30 min', content: ['Rate of reaction = change in concentration / time. Factors affecting rate: temperature (more kinetic energy, more successful collisions), concentration/pressure (more particles per volume), surface area, and catalysts (provide alternative lower-energy pathway).', 'Collision theory: for a reaction to occur, particles must collide with sufficient energy (≥ activation energy Ea) and correct orientation. Maxwell-Boltzmann distribution shows how temperature affects the proportion of particles exceeding Ea.'], objectives: ['Describe and explain factors affecting reaction rate', 'Interpret Maxwell-Boltzmann distribution curves', 'Explain the role of catalysts using energy profiles'] },
      ]
    },
    {
      id: 'a-bio', name: 'Biology', totalLessons: 6,
      lessons: [
        { id: 'a-bio-1', title: 'Biological Molecules', duration: '35 min', content: ['Carbohydrates consist of monosaccharides (glucose, fructose), disaccharides (maltose, sucrose, lactose), and polysaccharides (starch, glycogen, cellulose). They are formed by condensation reactions and broken by hydrolysis.', 'Proteins are polymers of amino acids linked by peptide bonds. Protein structure has four levels: primary (amino acid sequence), secondary (α-helix, β-sheet), tertiary (3D folding), and quaternary (multiple polypeptides). Lipids include triglycerides (energy storage) and phospholipids (cell membranes).'], objectives: ['Describe the structure and function of biological molecules', 'Explain condensation and hydrolysis reactions', 'Relate molecular structure to function'] },
        { id: 'a-bio-2', title: 'Cell Division: Mitosis & Meiosis', duration: '30 min', content: ['Mitosis produces two genetically identical daughter cells for growth and repair. Stages: prophase (chromosomes condense), metaphase (align at equator), anaphase (chromatids separate), telophase (nuclear envelopes reform).', 'Meiosis produces four genetically different haploid gametes. It involves two divisions and creates genetic variation through crossing over (prophase I) and independent assortment (metaphase I). This variation is essential for evolution by natural selection.'], objectives: ['Compare mitosis and meiosis', 'Describe the stages of each type of cell division', 'Explain the significance of meiosis in creating variation'] },
        { id: 'a-bio-3', title: 'DNA, Genes & Protein Synthesis', duration: '35 min', content: ['DNA is a double helix of two antiparallel polynucleotide chains linked by hydrogen bonds between complementary bases (A-T, G-C). A gene is a sequence of DNA that codes for a polypeptide. The genetic code is a triplet code, degenerate, and universal.', 'Transcription: DNA → mRNA in the nucleus (RNA polymerase). Translation: mRNA → protein at ribosomes. tRNA molecules carry amino acids to the ribosome, where the anticodon matches the mRNA codon. Mutations are changes in the base sequence.'], objectives: ['Describe DNA structure and replication', 'Explain transcription and translation', 'Discuss the effects of gene mutations'] },
        { id: 'a-bio-4', title: 'Genetics & Inheritance', duration: '30 min', content: ['Mendel\'s laws: (1) Law of Segregation—alleles separate during gamete formation. (2) Law of Independent Assortment—genes on different chromosomes are inherited independently. Genotype is the alleles present; phenotype is the expressed characteristic.', 'Genetic crosses use Punnett squares. Monohybrid crosses involve one gene; dihybrid crosses involve two. Codominance (both alleles expressed, e.g., AB blood group), sex linkage (genes on X chromosome, e.g., haemophilia), and epistasis (one gene affects another) extend Mendelian genetics.'], objectives: ['Use genetic diagrams and Punnett squares', 'Predict ratios for mono- and dihybrid crosses', 'Explain codominance, sex linkage, and epistasis'] },
        { id: 'a-bio-5', title: 'Ecology & Conservation', duration: '30 min', content: ['Energy flows through ecosystems via food chains. Only about 10% of energy transfers between trophic levels (lost as heat through respiration). Nutrient cycles (carbon, nitrogen) recycle elements through biotic and abiotic components.', 'Biodiversity is threatened by habitat destruction, climate change, pollution, and overexploitation. Conservation strategies include protected areas, captive breeding, seed banks, and international agreements (CITES). Zimbabwe\'s wildlife conservation, including CAMPFIRE, demonstrates community-based approaches.'], objectives: ['Describe energy flow and nutrient cycling in ecosystems', 'Explain threats to biodiversity', 'Evaluate conservation strategies including Zimbabwe examples'] },
        { id: 'a-bio-6', title: 'Transport in Plants & Animals', duration: '30 min', content: ['In plants, water moves from roots to leaves via xylem by transpiration pull (cohesion-tension theory). Stomata control water loss; guard cells open/close based on turgor. Sucrose moves in phloem by translocation (mass flow hypothesis).', 'In mammals, the heart is a double pump: right side pumps to lungs (pulmonary circulation), left side pumps to body (systemic circulation). Blood vessels: arteries (thick walls, high pressure), veins (valves, low pressure), capillaries (thin walls for exchange).'], objectives: ['Explain water transport in plants', 'Describe the structure and function of the heart and blood vessels', 'Compare transport mechanisms in plants and animals'] },
      ]
    },
    {
      id: 'a-econ', name: 'Economics', totalLessons: 6,
      lessons: [
        { id: 'a-econ-1', title: 'Supply & Demand', duration: '30 min', content: ['Demand is the quantity consumers are willing and able to buy at different prices. The law of demand: as price rises, quantity demanded falls (ceteris paribus). The demand curve slopes downward. Shifts in demand are caused by income, tastes, prices of substitutes/complements, and population.', 'Supply is the quantity producers are willing to sell at different prices. The law of supply: as price rises, quantity supplied rises. Supply shifts are caused by costs of production, technology, government policies, and number of firms. Market equilibrium occurs where supply equals demand.'], objectives: ['Explain the laws of demand and supply', 'Distinguish between movements along and shifts of curves', 'Determine market equilibrium price and quantity'] },
        { id: 'a-econ-2', title: 'Elasticity', duration: '30 min', content: ['Price elasticity of demand (PED) = % change in quantity demanded / % change in price. Elastic demand (PED > 1): quantity responds more than proportionally to price. Inelastic (PED < 1): quantity responds less. Determinants include availability of substitutes, necessity vs luxury, and time.', 'Income elasticity of demand (YED): normal goods have positive YED, inferior goods have negative YED. Cross elasticity (XED): substitutes have positive XED, complements have negative XED. These concepts help businesses set prices and governments predict tax revenue.'], objectives: ['Calculate and interpret PED, YED, and XED', 'Explain determinants of elasticity', 'Apply elasticity to business and government decisions'] },
        { id: 'a-econ-3', title: 'Market Failure & Government Intervention', duration: '30 min', content: ['Market failure occurs when free markets do not allocate resources efficiently. Causes include externalities (costs/benefits to third parties), public goods (non-excludable, non-rivalrous), information asymmetry, and monopoly power.', 'Government interventions include taxation (to correct negative externalities), subsidies (to encourage positive externalities), regulation, provision of public goods, and minimum/maximum prices. However, government failure can also occur when intervention makes outcomes worse.'], objectives: ['Explain causes of market failure', 'Evaluate government interventions', 'Discuss the concept of government failure'] },
        { id: 'a-econ-4', title: 'National Income & Economic Growth', duration: '30 min', content: ['GDP (Gross Domestic Product) measures the total value of goods and services produced in a country in a year. Real GDP adjusts for inflation. GDP per capita = GDP / population, indicating average living standards.', 'Economic growth is an increase in real GDP over time. Actual growth uses existing capacity; potential growth expands capacity through investment, education, and technology. Costs of growth may include environmental damage and inequality. Zimbabwe\'s economic challenges illustrate these concepts.'], objectives: ['Define and calculate GDP and GDP per capita', 'Distinguish between actual and potential economic growth', 'Evaluate costs and benefits of economic growth'] },
        { id: 'a-econ-5', title: 'Money, Banking & Inflation', duration: '25 min', content: ['Money functions as a medium of exchange, store of value, unit of account, and standard of deferred payment. Commercial banks create credit through the money multiplier (1/reserve ratio). Central banks (Reserve Bank of Zimbabwe) control money supply and interest rates.', 'Inflation is a sustained increase in the general price level. Causes: demand-pull (too much money chasing too few goods) and cost-push (rising production costs). Effects include reduced purchasing power, redistribution of income, and uncertainty. Zimbabwe\'s hyperinflation experience provides a key case study.'], objectives: ['Explain the functions of money and banking', 'Describe causes and effects of inflation', 'Analyse monetary policy tools'] },
        { id: 'a-econ-6', title: 'International Trade', duration: '25 min', content: ['Countries trade because of comparative advantage—a country should specialise in goods where it has the lowest opportunity cost. This leads to increased output and mutual gains from trade.', 'Trade barriers include tariffs (taxes on imports), quotas (quantity limits), and embargoes. Arguments for protection include infant industry, national security, and employment. Zimbabwe\'s trade relationships and the impact of sanctions demonstrate these principles in practice.'], objectives: ['Explain the theory of comparative advantage', 'Describe types of trade barriers', 'Evaluate arguments for and against protectionism'] },
      ]
    },
    {
      id: 'a-lit', name: 'Literature in English', totalLessons: 5,
      lessons: [
        { id: 'a-lit-1', title: 'Poetry Analysis Techniques', duration: '30 min', content: ['Poetry analysis examines form (sonnet, free verse, ode), structure (stanzas, enjambment, caesura), language (diction, imagery, figurative language), and meaning (themes, tone, mood).', 'Key literary devices: metaphor (direct comparison), simile (using "like" or "as"), personification (giving human qualities), alliteration (repeated initial consonants), assonance (repeated vowel sounds), and symbolism (objects representing ideas). Always link devices to their effect on the reader.'], objectives: ['Identify poetic forms and structures', 'Analyse the effect of literary devices', 'Write structured poetry essays with textual evidence'] },
        { id: 'a-lit-2', title: 'The Novel: Narrative Techniques', duration: '35 min', content: ['Narrative perspective shapes how we experience a story. First person ("I") creates intimacy but limits knowledge. Third person omniscient gives access to all characters\' thoughts. Third person limited follows one character. Second person ("you") is rare but creates immediacy.', 'Other techniques include stream of consciousness, unreliable narrators, flashback/foreshadowing, and frame narratives. Consider how the narrative technique affects the reader\'s understanding of themes, characters, and events.'], objectives: ['Identify and analyse narrative techniques', 'Explain how perspective affects interpretation', 'Discuss the relationship between form and meaning'] },
        { id: 'a-lit-3', title: 'African Literature: Themes & Context', duration: '35 min', content: ['African literature explores themes of colonialism and its legacy, cultural identity, tradition vs modernity, corruption, and the search for selfhood. Key writers include Chinua Achebe (Things Fall Apart), Ngũgĩ wa Thiong\'o (Decolonising the Mind), and Tsitsi Dangarembga (Nervous Conditions).', 'Understanding historical and cultural context is essential. Post-colonial literature examines the psychological and social effects of colonialism. Zimbabwean literature, including works by Dangarembga, Vera, and Marechera, addresses specific national experiences and universal human themes.'], objectives: ['Discuss key themes in African literature', 'Analyse texts in their historical and cultural context', 'Compare approaches of different African writers'] },
        { id: 'a-lit-4', title: 'Drama: Shakespeare', duration: '30 min', content: ['Shakespeare\'s plays combine universal themes (love, power, jealousy, ambition) with masterful language. Tragedies (Macbeth, Hamlet, Othello) show a hero\'s downfall through a fatal flaw (hamartia). Comedies (Twelfth Night, Much Ado) end in reconciliation and marriage.', 'Key techniques include soliloquies (character speaks thoughts aloud), dramatic irony (audience knows more than characters), blank verse (unrhymed iambic pentameter), and prose (lower-status characters or informal moments). Analyse how these create meaning and dramatic effect.'], objectives: ['Analyse Shakespeare\'s dramatic techniques', 'Discuss themes and characterisation', 'Write essays on set Shakespeare texts'] },
        { id: 'a-lit-5', title: 'Writing Critical Essays', duration: '25 min', content: ['A strong literary essay has a clear thesis (argument) supported by textual evidence. Use the Point-Evidence-Explain (PEE) or Point-Evidence-Analysis-Link (PEAL) structure for each paragraph.', 'Avoid retelling the story—analyse how the writer creates meaning through language, structure, and form. Use literary terminology precisely. Compare texts where required, finding both similarities and differences. Conclude by synthesising your argument and addressing the wider significance.'], objectives: ['Develop clear thesis statements', 'Integrate textual evidence effectively', 'Write analytical rather than descriptive essays'] },
      ]
    },
  ],
};

// ===== MAIN COMPONENT =====
const ELearnPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const [progress, setProgress] = useLocalStorage<UserProgress>('elearn-progress', {
    completedLessons: [],
    recentActivity: [],
    streak: 1,
    lastStudyDate: new Date().toISOString().split('T')[0],
    totalTimeMinutes: 0,
  });

  const [settings, setSettings] = useLocalStorage<UserSettings>('elearn-settings', {
    displayName: 'Student',
    level: 'Both',
    notifications: true,
    fontSize: 'medium',
  });

  // ===== DERIVED DATA =====
  const allSubjects = useMemo(() => {
    const result: Subject[] = [];
    Object.values(SUBJECTS).forEach(subjects => result.push(...subjects));
    return result;
  }, []);

  const totalLessons = useMemo(() =>
    allSubjects.reduce((sum, s) => sum + s.lessons.length, 0), [allSubjects]);

  const completedCount = progress.completedLessons.length;

  const getSubjectProgress = (subject: Subject) => {
    const completed = subject.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    return { completed, total: subject.lessons.length, percent: subject.lessons.length > 0 ? Math.round((completed / subject.lessons.length) * 100) : 0 };
  };

  const selectedSubject = useMemo(() =>
    selectedSubjectId ? allSubjects.find(s => s.id === selectedSubjectId) : null, [selectedSubjectId, allSubjects]);

  const selectedLesson = useMemo(() =>
    selectedLessonId && selectedSubject ? selectedSubject.lessons.find(l => l.id === selectedLessonId) : null, [selectedLessonId, selectedSubject]);

  // ===== ACTIONS =====
  const openSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedLessonId(null);
    setActiveTab('courses');
    setSidebarOpen(false);
  };

  const openLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
  };

  const toggleLessonComplete = (lessonId: string, subjectName: string, lessonTitle: string) => {
    setProgress(prev => {
      const isCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = isCompleted
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId];

      const newActivity: Activity[] = isCompleted
        ? prev.recentActivity
        : [{ subject: subjectName, lesson: lessonTitle, timestamp: Date.now(), lessonId }, ...prev.recentActivity].slice(0, 20);

      const today = new Date().toISOString().split('T')[0];
      const newStreak = prev.lastStudyDate !== today ? prev.streak + 1 : prev.streak;

      return {
        ...prev,
        completedLessons: newCompleted,
        recentActivity: newActivity,
        streak: newStreak,
        lastStudyDate: today,
        totalTimeMinutes: prev.totalTimeMinutes + (isCompleted ? 0 : 25),
      };
    });
  };

  const goBack = () => {
    if (selectedLessonId) {
      setSelectedLessonId(null);
    } else if (selectedSubjectId) {
      setSelectedSubjectId(null);
    }
  };

  // ===== FILTERED SUBJECTS =====
  const filteredSubjects = useMemo(() => {
    const result: Record<string, Subject[]> = {};
    Object.entries(SUBJECTS).forEach(([level, subjects]) => {
      if (filterLevel !== 'all') {
        if (filterLevel === 'o' && !level.includes('O Level')) return;
        if (filterLevel === 'a' && !level.includes('A Level')) return;
      }
      const filtered = subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) result[level] = filtered;
    });
    return result;
  }, [searchQuery, filterLevel]);

  // ===== LESSON VIEW =====
  const LessonView: React.FC = () => {
    if (!selectedLesson || !selectedSubject) return null;
    const isComplete = progress.completedLessons.includes(selectedLesson.id);

    return (
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors" aria-label="Back to course">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to {selectedSubject.name}
        </button>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedLesson.duration}</span>
                <span>{selectedSubject.name}</span>
              </div>
            </div>
            <button
              onClick={() => toggleLessonComplete(selectedLesson.id, selectedSubject.name, selectedLesson.title)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isComplete ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              aria-label={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <CheckCircle className="w-5 h-5" />
              {isComplete ? 'Completed' : 'Mark Complete'}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" /> Learning Objectives</h3>
            <ul className="space-y-2">
              {selectedLesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <ChevronRight className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-500" /> Lesson Content</h3>
            {selectedLesson.content.map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Navigation between lessons */}
        <div className="flex justify-between">
          {(() => {
            const idx = selectedSubject.lessons.findIndex(l => l.id === selectedLesson.id);
            const prev = idx > 0 ? selectedSubject.lessons[idx - 1] : null;
            const next = idx < selectedSubject.lessons.length - 1 ? selectedSubject.lessons[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => openLesson(prev.id)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> {prev.title}
                  </button>
                ) : <div />}
                {next ? (
                  <button onClick={() => openLesson(next.id)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {next.title} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : <div />}
              </>
            );
          })()}
        </div>
      </div>
    );
  };

  // ===== COURSE DETAIL VIEW =====
  const CourseDetailView: React.FC = () => {
    if (!selectedSubject) return null;
    const prog = getSubjectProgress(selectedSubject);

    return (
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors" aria-label="Back to courses">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </button>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedSubject.name}</h2>
                <p className="text-gray-500">{selectedSubject.lessons.length} lessons</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{prog.percent}%</div>
              <div className="text-sm text-gray-500">{prog.completed}/{prog.total} completed</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: `${prog.percent}%` }} role="progressbar" aria-valuenow={prog.percent} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {selectedSubject.lessons.map((lesson, idx) => {
            const isComplete = progress.completedLessons.includes(lesson.id);
            return (
              <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openLesson(lesson.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" /> {lesson.duration}
                      <span className="mx-1">•</span>
                      {lesson.objectives.length} objectives
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ===== HOME PAGE =====
  const HomePage: React.FC = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {settings.displayName}</h1>
        <p className="text-xl mb-6 opacity-90">Bridging the education gap in Zimbabwe</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-sm opacity-80">Lessons Done</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1"><Flame className="w-5 h-5" />{progress.streak}</div>
            <div className="text-sm opacity-80">Day Streak</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Math.round(progress.totalTimeMinutes / 60)}h</div>
            <div className="text-sm opacity-80">Study Time</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%</div>
            <div className="text-sm opacity-80">Overall</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(SUBJECTS).map(([level, subjects]) => (
          <div key={level} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 ${level.includes('O Level') ? 'bg-blue-100' : 'bg-purple-100'} rounded-lg flex items-center justify-center mr-4`}>
                {level.includes('O Level') ? <BookOpen className="w-6 h-6 text-blue-600" /> : <Award className="w-6 h-6 text-purple-600" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{level}</h3>
                <p className="text-gray-600">{level.includes('O Level') ? 'Foundation secondary' : 'Advanced secondary'} education</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {subjects.slice(0, 6).map(subject => {
                const prog = getSubjectProgress(subject);
                return (
                  <button key={subject.id} onClick={() => openSubject(subject.id)} className="text-left text-sm bg-gray-50 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-colors">
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-gray-500">{subject.lessons.length} lessons</div>
                    {prog.completed > 0 && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${prog.percent}%` }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { setActiveTab('courses'); setFilterLevel(level.includes('O Level') ? 'o' : 'a'); setSidebarOpen(false); }}
              className={`w-full ${level.includes('O Level') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white py-3 rounded-lg transition-colors`}
            >
              Start {level.includes('O Level') ? 'O' : 'A'} Level Courses
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {progress.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Your Recent Activity</h3>
          <div className="space-y-3">
            {progress.recentActivity.slice(0, 6).map((activity, idx) => (
              <div key={`${activity.lessonId}-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{activity.lesson}</div>
                  <div className="text-xs text-gray-500">{activity.subject} • {formatTimeAgo(activity.timestamp)}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ===== COURSES PAGE =====
  const CoursesPage: React.FC = () => {
    if (selectedLessonId && selectedSubject) return <LessonView />;
    if (selectedSubjectId) return <CourseDetailView />;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                aria-label="Search courses"
              />
            </div>
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
              aria-label="Filter by level"
            >
              <option value="all">All Levels</option>
              <option value="o">ZIMSEC O Level</option>
              <option value="a">ZIMSEC A Level</option>
            </select>
          </div>
        </div>

        {Object.keys(filteredSubjects).length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses match your search.</p>
          </div>
        ) : (
          Object.entries(filteredSubjects).map(([level, levelSubjects]) => (
            <div key={level} className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">{level}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelSubjects.map(subject => {
                  const prog = getSubjectProgress(subject);
                  return (
                    <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${prog.percent === 100 ? 'bg-green-100 text-green-800' : prog.percent > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                          {prog.percent}% Complete
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">{subject.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{subject.lessons.length} lessons • {prog.completed} completed</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3" role="progressbar" aria-valuenow={prog.percent} aria-valuemin={0} aria-valuemax={100}>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${prog.percent}%` }} />
                      </div>
                      <button
                        onClick={() => openSubject(subject.id)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {prog.completed > 0 ? 'Continue Learning' : 'Start Learning'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // ===== PROFILE PAGE =====
  const ProfilePage: React.FC = () => {
    const topSubjects = allSubjects
      .map(s => ({ ...s, prog: getSubjectProgress(s) }))
      .filter(s => s.prog.completed > 0)
      .sort((a, b) => b.prog.percent - a.prog.percent)
      .slice(0, 5);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{settings.displayName}</h2>
              <p className="text-gray-600 mb-2">ZIMSEC {settings.level} Student</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Level: {settings.level}</span>
                {progress.streak >= 3 && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Active Learner</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Learning Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span>Total Lessons Completed</span><span className="font-semibold">{completedCount}</span></div>
              <div className="flex justify-between items-center"><span>Study Streak</span><span className="font-semibold text-orange-600 flex items-center gap-1"><Flame className="w-4 h-4" />{progress.streak} days</span></div>
              <div className="flex justify-between items-center"><span>Overall Progress</span><span className="font-semibold text-green-600">{totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%</span></div>
              <div className="flex justify-between items-center"><span>Time Spent Learning</span><span className="font-semibold">{Math.floor(progress.totalTimeMinutes / 60)}h {progress.totalTimeMinutes % 60}m</span></div>
              <div className="flex justify-between items-center"><span>Subjects Available</span><span className="font-semibold">{allSubjects.length}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="space-y-3">
              {completedCount >= 1 && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <div><div className="font-medium text-sm">First Step</div><div className="text-xs text-gray-600">Completed your first lesson</div></div>
                </div>
              )}
              {completedCount >= 10 && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <div><div className="font-medium text-sm">Dedicated Learner</div><div className="text-xs text-gray-600">Completed 10 lessons</div></div>
                </div>
              )}
              {progress.streak >= 3 && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <div><div className="font-medium text-sm">Consistent Learner</div><div className="text-xs text-gray-600">{progress.streak}-day study streak</div></div>
                </div>
              )}
              {completedCount === 0 && progress.streak < 3 && (
                <p className="text-gray-500 text-sm text-center py-4">Complete lessons to earn achievements!</p>
              )}
            </div>
          </div>
        </div>

        {topSubjects.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Subject Progress</h3>
            <div className="space-y-4">
              {topSubjects.map(subject => (
                <button key={subject.id} onClick={() => openSubject(subject.id)} className="w-full flex items-center space-x-4 hover:bg-gray-50 rounded-lg p-1 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium truncate">{subject.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{subject.prog.completed}/{subject.prog.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all" style={{ width: `${subject.prog.percent}%` }} />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 w-12 text-right">{subject.prog.percent}%</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== ANALYTICS PAGE =====
  const AnalyticsPage: React.FC = () => {
    const subjectStats = allSubjects.map(s => ({
      name: s.name,
      ...getSubjectProgress(s),
    })).filter(s => s.completed > 0).sort((a, b) => b.percent - a.percent);

    const levelStats = Object.entries(SUBJECTS).map(([level, subjects]) => {
      const total = subjects.reduce((sum, s) => sum + s.lessons.length, 0);
      const completed = subjects.reduce((sum, s) => sum + s.lessons.filter(l => progress.completedLessons.includes(l.id)).length, 0);
      return { level, total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600">{completedCount}</div>
            <div className="text-sm text-gray-500">Lessons Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600">{totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-orange-600">{progress.streak}</div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600">{Math.round(progress.totalTimeMinutes / 60)}h</div>
            <div className="text-sm text-gray-500">Study Time</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Progress by Level</h3>
          <div className="space-y-4">
            {levelStats.map(stat => (
              <div key={stat.level}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{stat.level}</span>
                  <span className="text-sm text-gray-600">{stat.completed}/{stat.total} lessons ({stat.percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className={`${stat.level.includes('O Level') ? 'bg-blue-500' : 'bg-purple-500'} h-4 rounded-full transition-all duration-500`} style={{ width: `${stat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Subject Completion</h3>
          {subjectStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Start completing lessons to see analytics here.</p>
          ) : (
            <div className="space-y-3">
              {subjectStats.map(stat => (
                <div key={stat.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700 truncate">{stat.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${Math.max(stat.percent, 8)}%` }}>
                      <span className="text-xs text-white font-medium">{stat.percent}%</span>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-500 text-right">{stat.completed}/{stat.total}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
          {progress.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activity yet. Start learning!</p>
          ) : (
            <div className="space-y-3">
              {progress.recentActivity.slice(0, 10).map((activity, idx) => (
                <div key={`${activity.lessonId}-${idx}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{activity.lesson}</div>
                    <div className="text-xs text-gray-500">{activity.subject}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{formatTimeAgo(activity.timestamp)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== SETTINGS PAGE =====
  const SettingsPage: React.FC = () => {
    const [nameInput, setNameInput] = useState(settings.displayName);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
      setSettings(prev => ({ ...prev, displayName: nameInput }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Settings</h2>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <div className="flex gap-3">
                <input
                  id="displayName"
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  maxLength={50}
                />
                <button
                  onClick={handleSave}
                  className={`px-6 py-2 rounded-lg transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {saved ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Preferred Level</label>
              <select
                id="level"
                value={settings.level}
                onChange={e => setSettings(prev => ({ ...prev, level: e.target.value as UserSettings['level'] }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Both">Both O Level & A Level</option>
                <option value="O Level">ZIMSEC O Level</option>
                <option value="A Level">ZIMSEC A Level</option>
              </select>
            </div>

            <div>
              <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <select
                id="fontSize"
                value={settings.fontSize}
                onChange={e => setSettings(prev => ({ ...prev, fontSize: e.target.value as UserSettings['fontSize'] }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium">Study Reminders</div>
              <div className="text-sm text-gray-500">Get reminders to maintain your study streak</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={e => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="sr-only"
                aria-label="Toggle study reminders"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings.notifications ? 'translate-x-5.5 ml-[22px]' : 'translate-x-0.5 ml-[2px]'}`} />
              </div>
            </div>
          </label>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Data Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Completed Lessons</div>
                <div className="text-xs text-gray-500">{completedCount} lessons tracked locally</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                  setProgress({ completedLessons: [], recentActivity: [], streak: 0, lastStudyDate: '', totalTimeMinutes: 0 });
                }
              }}
              className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===== NAVIGATION =====
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'My Courses', icon: Library },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'courses': return <CoursesPage />;
      case 'profile': return <ProfilePage />;
      case 'analytics': return <AnalyticsPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed lg:relative z-40 w-64 h-full`} role="navigation" aria-label="Main navigation">
        <div className="bg-white h-full shadow-lg border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">eLearn</h1>
                <p className="text-xs text-gray-500">by GliT</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSelectedSubjectId(null);
                        setSelectedLessonId(null);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{progress.streak} day streak</span>
            </div>
            <p className="text-xs text-gray-500 text-center">Bridging the education gap in Zimbabwe</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// ===== UTILITIES =====
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default ELearnPlatform;
