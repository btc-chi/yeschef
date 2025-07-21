import { Recipe } from '@/store/meal-planner';

// Special "Going Out" templates
export const GOING_OUT_TEMPLATES: Recipe[] = [
  {
    id: 'lunch-out',
    name: 'Lunch Out',
    description: 'Click to edit restaurant name',
    prepTime: '60 min',
    difficulty: 'Easy',
    calories: 0,
    cuisine: 'Restaurant',
    ingredients: [],
    instructions: ['Enjoy dining out!'],
    proteins: [],
    vegetables: [],
    starches: [],
    isGoingOut: true,
    mealType: 'lunch'
  },
  {
    id: 'dinner-out',
    name: 'Dinner Out',
    description: 'Click to edit restaurant name',
    prepTime: '90 min',
    difficulty: 'Easy',
    calories: 0,
    cuisine: 'Restaurant',
    ingredients: [],
    instructions: ['Enjoy dining out!'],
    proteins: [],
    vegetables: [],
    starches: [],
    isGoingOut: true,
    mealType: 'dinner'
  }
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Spicy Korean Bowl',
    description: 'Bold flavors with gochujang chicken, sesame bok choy, and jasmine rice',
    prepTime: '25 min',
    difficulty: 'Medium',
    calories: 432,
    cuisine: 'Korean',
    ingredients: [
      '2 chicken thighs',
      '2 tbsp gochujang',
      '4 baby bok choy',
      '1 cup jasmine rice',
      '2 tbsp sesame oil',
      '1 tbsp soy sauce',
      '2 cloves garlic',
      '1 inch ginger'
    ],
    instructions: [
      'Marinate chicken thighs in gochujang for 20 minutes',
      'Cook jasmine rice according to package directions',
      'Sear chicken in hot pan until crispy and cooked through',
      'Stir-fry bok choy with garlic and ginger',
      'Serve over rice with sesame oil drizzle'
    ],
    proteins: ['chicken thigh'],
    vegetables: ['bok choy', 'garlic', 'ginger'],
    starches: ['jasmine rice']
  },
  {
    id: '2',
    name: 'Lemon Garlic Pasta',
    description: 'Simple yet elegant pasta with fresh herbs and parmesan',
    prepTime: '15 min',
    difficulty: 'Easy',
    calories: 385,
    cuisine: 'Italian',
    ingredients: [
      '8 oz linguine',
      '4 cloves garlic',
      '1 lemon (zested and juiced)',
      '1/4 cup olive oil',
      '1/2 cup parmesan cheese',
      '2 tbsp fresh parsley',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Cook linguine until al dente',
      'Sauté garlic in olive oil until fragrant',
      'Add lemon zest and juice to pan',
      'Toss pasta with garlic lemon mixture',
      'Top with parmesan and parsley'
    ],
    proteins: ['parmesan cheese'],
    vegetables: ['garlic', 'parsley'],
    starches: ['linguine']
  },
  {
    id: '3',
    name: 'Miso Glazed Salmon',
    description: 'Restaurant-quality salmon with umami-rich glaze',
    prepTime: '20 min',
    difficulty: 'Medium',
    calories: 420,
    cuisine: 'Japanese',
    ingredients: [
      '4 salmon fillets',
      '3 tbsp white miso paste',
      '2 tbsp mirin',
      '1 tbsp rice vinegar',
      '1 tsp honey',
      '2 tbsp sesame seeds',
      '4 shiitake mushrooms',
      '2 cups spinach'
    ],
    instructions: [
      'Whisk together miso, mirin, vinegar, and honey',
      'Brush salmon with half the glaze',
      'Broil salmon for 6-8 minutes',
      'Sauté mushrooms and spinach',
      'Serve salmon with remaining glaze'
    ],
    proteins: ['salmon'],
    vegetables: ['shiitake mushrooms', 'spinach'],
    starches: []
  },
  {
    id: '4',
    name: 'Mediterranean Bowl',
    description: 'Fresh and healthy bowl with chickpeas, feta, and herbs',
    prepTime: '10 min',
    difficulty: 'Easy',
    calories: 350,
    cuisine: 'Mediterranean',
    ingredients: [
      '1 can chickpeas',
      '1/2 cup feta cheese',
      '1 cucumber',
      '2 cups mixed greens',
      '1/4 red onion',
      '1/4 cup kalamata olives',
      '3 tbsp olive oil',
      '1 tbsp lemon juice',
      '1 tsp oregano'
    ],
    instructions: [
      'Rinse and drain chickpeas',
      'Dice cucumber and red onion',
      'Whisk olive oil, lemon juice, and oregano',
      'Combine all ingredients in bowl',
      'Top with feta and olives'
    ],
    proteins: ['chickpeas', 'feta cheese'],
    vegetables: ['cucumber', 'mixed greens', 'red onion'],
    starches: []
  },
  {
    id: '5',
    name: 'Braised Short Ribs',
    description: 'Fall-off-the-bone tender ribs with red wine reduction',
    prepTime: '3 hours',
    difficulty: 'Hard',
    calories: 580,
    cuisine: 'American',
    ingredients: [
      '3 lbs beef short ribs',
      '1 cup red wine',
      '2 cups beef broth',
      '2 carrots',
      '2 celery stalks',
      '1 onion',
      '4 cloves garlic',
      '2 tbsp tomato paste',
      'Fresh thyme'
    ],
    instructions: [
      'Season and sear short ribs until browned',
      'Sauté vegetables until softened',
      'Add tomato paste and cook 1 minute',
      'Add wine and broth, bring to simmer',
      'Braise covered for 2.5 hours until tender'
    ],
    proteins: ['beef short ribs'],
    vegetables: ['carrots', 'celery', 'onion', 'garlic'],
    starches: []
  },
  {
    id: '6',
    name: 'Thai Green Curry',
    description: 'Aromatic curry with coconut milk and fresh vegetables',
    prepTime: '30 min',
    difficulty: 'Medium',
    calories: 410,
    cuisine: 'Thai',
    ingredients: [
      '1 lb chicken breast',
      '1 can coconut milk',
      '2 tbsp green curry paste',
      '1 eggplant',
      '1 bell pepper',
      '1/4 cup thai basil',
      '2 tbsp fish sauce',
      '1 tbsp brown sugar',
      '2 cups jasmine rice'
    ],
    instructions: [
      'Cook jasmine rice',
      'Sauté curry paste until fragrant',
      'Add coconut milk and bring to simmer',
      'Add chicken and cook until done',
      'Add vegetables and cook until tender',
      'Season with fish sauce and sugar'
    ],
    proteins: ['chicken breast'],
    vegetables: ['eggplant', 'bell pepper', 'thai basil'],
    starches: ['jasmine rice']
  },
  {
    id: '7',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms and parmesan',
    prepTime: '45 min',
    difficulty: 'Hard',
    calories: 390,
    cuisine: 'Italian',
    ingredients: [
      '1.5 cups arborio rice',
      '6 cups warm chicken broth',
      '8 oz mixed mushrooms',
      '1/2 cup white wine',
      '1 onion',
      '3 cloves garlic',
      '1/2 cup parmesan',
      '2 tbsp butter',
      'Fresh parsley'
    ],
    instructions: [
      'Sauté mushrooms until golden, set aside',
      'Sauté onion and garlic until softened',
      'Add rice and toast for 2 minutes',
      'Add wine and stir until absorbed',
      'Gradually add warm broth, stirring constantly',
      'Stir in mushrooms, butter, and parmesan'
    ],
    proteins: ['parmesan'],
    vegetables: ['mushrooms', 'onion', 'garlic', 'parsley'],
    starches: ['arborio rice']
  },
  {
    id: '8',
    name: 'Fish Tacos',
    description: 'Crispy fish with cabbage slaw and lime crema',
    prepTime: '20 min',
    difficulty: 'Easy',
    calories: 320,
    cuisine: 'Mexican',
    ingredients: [
      '1 lb white fish fillets',
      '8 corn tortillas',
      '2 cups cabbage',
      '1/4 cup sour cream',
      '1 lime',
      '1/4 cup cilantro',
      '1 jalapeño',
      '1 tsp cumin',
      '1 tsp paprika'
    ],
    instructions: [
      'Season fish with cumin and paprika',
      'Pan fry fish until crispy',
      'Mix cabbage with lime juice and cilantro',
      'Combine sour cream with lime zest',
      'Warm tortillas and assemble tacos'
    ],
    proteins: ['white fish'],
    vegetables: ['cabbage', 'cilantro', 'jalapeño'],
    starches: ['corn tortillas']
  },
  {
    id: '9',
    name: 'Chicken Caesar Wrap',
    description: 'Crispy romaine, grilled chicken, and parmesan in a flour tortilla',
    prepTime: '10 min',
    difficulty: 'Easy',
    calories: 285,
    cuisine: 'American',
    ingredients: [
      '1 large flour tortilla',
      '4 oz grilled chicken breast',
      '2 cups romaine lettuce',
      '2 tbsp caesar dressing',
      '2 tbsp parmesan cheese',
      '1 tbsp croutons'
    ],
    instructions: [
      'Slice grilled chicken into strips',
      'Chop romaine lettuce',
      'Toss lettuce with caesar dressing',
      'Layer chicken and lettuce on tortilla',
      'Sprinkle with parmesan and roll tightly'
    ],
    proteins: ['chicken breast'],
    vegetables: ['romaine lettuce'],
    starches: ['flour tortilla']
  },
  {
    id: '10',
    name: 'Tomato Basil Soup',
    description: 'Creamy comfort soup with fresh basil and a touch of cream',
    prepTime: '15 min',
    difficulty: 'Easy',
    calories: 220,
    cuisine: 'American',
    ingredients: [
      '1 can crushed tomatoes',
      '1 cup vegetable broth',
      '1/4 cup heavy cream',
      '1/4 cup fresh basil',
      '2 cloves garlic',
      '1 small onion',
      '1 tbsp olive oil',
      'Salt and pepper'
    ],
    instructions: [
      'Sauté onion and garlic in olive oil',
      'Add crushed tomatoes and broth',
      'Simmer for 10 minutes',
      'Blend until smooth',
      'Stir in cream and fresh basil'
    ],
    proteins: [],
    vegetables: ['tomatoes', 'basil', 'garlic', 'onion'],
    starches: []
  },
  {
    id: '11',
    name: 'Asian Chicken Salad',
    description: 'Fresh greens with sesame-ginger dressing and crispy toppings',
    prepTime: '12 min',
    difficulty: 'Easy',
    calories: 310,
    cuisine: 'Asian',
    ingredients: [
      '4 oz grilled chicken breast',
      '4 cups mixed greens',
      '1/2 cup shredded carrots',
      '1/4 cup edamame',
      '2 tbsp sesame seeds',
      '2 tbsp sesame oil',
      '1 tbsp rice vinegar',
      '1 tsp honey',
      '1 tsp fresh ginger'
    ],
    instructions: [
      'Slice chicken into strips',
      'Whisk sesame oil, vinegar, honey, and ginger',
      'Toss greens with dressing',
      'Top with chicken, carrots, and edamame',
      'Sprinkle with sesame seeds'
    ],
    proteins: ['chicken breast', 'edamame'],
    vegetables: ['mixed greens', 'carrots', 'ginger'],
    starches: []
  },
  {
    id: '12',
    name: 'Turkey Club Sandwich',
    description: 'Classic triple-decker with turkey, bacon, lettuce, and tomato',
    prepTime: '8 min',
    difficulty: 'Easy',
    calories: 375,
    cuisine: 'American',
    ingredients: [
      '3 slices whole wheat bread',
      '4 oz sliced turkey',
      '2 strips bacon',
      '2 lettuce leaves',
      '2 tomato slices',
      '2 tbsp mayonnaise',
      '1 slice cheese'
    ],
    instructions: [
      'Toast bread until golden',
      'Cook bacon until crispy',
      'Spread mayo on all bread slices',
      'Layer turkey, cheese, lettuce, tomato, and bacon',
      'Stack layers and secure with toothpicks'
    ],
    proteins: ['turkey', 'bacon', 'cheese'],
    vegetables: ['lettuce', 'tomato'],
    starches: ['whole wheat bread']
  },
  {
    id: '13',
    name: 'Leftover Chicken Wrap',
    description: 'Quick lunch using yesterday\'s chicken with fresh vegetables',
    prepTime: '5 min',
    difficulty: 'Easy',
    calories: 295,
    cuisine: 'American',
    ingredients: [
      '1 large tortilla',
      '4 oz leftover chicken',
      '1/4 cup shredded lettuce',
      '2 tbsp diced tomatoes',
      '1 tbsp ranch dressing',
      '1 slice cheese',
      '1 tbsp diced cucumber'
    ],
    instructions: [
      'Shred or dice leftover chicken',
      'Warm tortilla slightly',
      'Spread ranch dressing on tortilla',
      'Layer chicken, cheese, and vegetables',
      'Roll tightly and slice in half'
    ],
    proteins: ['chicken', 'cheese'],
    vegetables: ['lettuce', 'tomatoes', 'cucumber'],
    starches: ['tortilla']
  },
  {
    id: '14',
    name: 'Quinoa Power Bowl',
    description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini',
    prepTime: '18 min',
    difficulty: 'Easy',
    calories: 340,
    cuisine: 'Mediterranean',
    ingredients: [
      '1/2 cup quinoa',
      '1/2 cup roasted sweet potato',
      '1/4 cup chickpeas',
      '2 cups spinach',
      '2 tbsp tahini',
      '1 tbsp lemon juice',
      '1 tbsp olive oil',
      '1 tsp garlic powder'
    ],
    instructions: [
      'Cook quinoa according to package directions',
      'Roast sweet potato cubes at 400°F for 15 minutes',
      'Whisk tahini, lemon juice, and garlic powder',
      'Layer quinoa, spinach, sweet potato, and chickpeas',
      'Drizzle with tahini dressing'
    ],
    proteins: ['quinoa', 'chickpeas'],
    vegetables: ['sweet potato', 'spinach'],
    starches: ['quinoa']
  },
  {
    id: '15',
    name: 'Greek Lemon Soup',
    description: 'Light and tangy avgolemono with rice and herbs',
    prepTime: '20 min',
    difficulty: 'Medium',
    calories: 195,
    cuisine: 'Greek',
    ingredients: [
      '6 cups chicken broth',
      '1/3 cup rice',
      '2 eggs',
      '1/4 cup lemon juice',
      '2 tbsp fresh dill',
      '1 tbsp olive oil',
      'Salt and pepper'
    ],
    instructions: [
      'Bring broth to boil, add rice',
      'Simmer until rice is tender',
      'Whisk eggs with lemon juice',
      'Slowly add hot broth to egg mixture',
      'Return to pot, add dill and season'
    ],
    proteins: ['eggs'],
    vegetables: ['dill'],
    starches: ['rice']
  },
  {
    id: '16',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
    prepTime: '5 min',
    difficulty: 'Easy',
    calories: 260,
    cuisine: 'Italian',
    ingredients: [
      '8 oz fresh mozzarella',
      '2 large tomatoes',
      '1/4 cup fresh basil',
      '2 tbsp balsamic glaze',
      '2 tbsp olive oil',
      'Sea salt',
      'Black pepper'
    ],
    instructions: [
      'Slice mozzarella and tomatoes',
      'Arrange alternating on plate',
      'Tuck basil leaves between slices',
      'Drizzle with olive oil and balsamic',
      'Season with salt and pepper'
    ],
    proteins: ['mozzarella'],
    vegetables: ['tomatoes', 'basil'],
    starches: []
  }
];

export const getCuisineIcon = (cuisine: string) => {
  const icons: { [key: string]: string } = {
    'Italian': '🍝',
    'American': '🍖',
    'Mexican': '🌮',
    'Asian': '🥢',
    'Japanese': '🍱',
    'Korean': '🌶️',
    'Thai': '🌿',
    'Mediterranean': '🫒',
    'Greek': '🏛️',
    'French': '🥖',
    'Indian': '🍛',
    'Middle Eastern': '🧆',
    'Restaurant': '🍽️'
  };
  
  // Handle fusion cuisines by checking for keywords
  const lowerCuisine = cuisine.toLowerCase();
  if (lowerCuisine.includes('japanese')) return '🍱';
  if (lowerCuisine.includes('mexican')) return '🌮';
  if (lowerCuisine.includes('korean')) return '🌶️';
  if (lowerCuisine.includes('italian')) return '🍝';
  if (lowerCuisine.includes('mediterranean')) return '🫒';
  if (lowerCuisine.includes('indian')) return '🍛';
  if (lowerCuisine.includes('thai')) return '🌿';
  if (lowerCuisine.includes('french')) return '🥖';
  if (lowerCuisine.includes('greek')) return '🏛️';
  if (lowerCuisine.includes('middle eastern')) return '🧆';
  if (lowerCuisine.includes('asian')) return '🥢';
  if (lowerCuisine.includes('american')) return '🍖';
  if (lowerCuisine.includes('fusion')) return '🌍'; // Special fusion emoji
  if (lowerCuisine.includes('caribbean')) return '🏝️';
  if (lowerCuisine.includes('vegan')) return '🌱';
  if (lowerCuisine.includes('tropical')) return '🥥';
  
  return icons[cuisine] || '🍽️';
};