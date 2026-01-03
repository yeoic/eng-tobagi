import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();

  // Create ingredients
  const ingredients = await Promise.all([
    // 채소류
    prisma.ingredient.create({
      data: { name: "대파", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "양파", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "마늘", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "당근", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "감자", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "애호박", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "시금치", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "배추", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "콩나물", category: "채소" },
    }),
    prisma.ingredient.create({
      data: { name: "버섯", category: "채소" },
    }),
    // 육류
    prisma.ingredient.create({
      data: { name: "돼지고기", category: "육류" },
    }),
    prisma.ingredient.create({
      data: { name: "소고기", category: "육류" },
    }),
    prisma.ingredient.create({
      data: { name: "닭고기", category: "육류" },
    }),
    // 해산물
    prisma.ingredient.create({
      data: { name: "두부", category: "기타" },
    }),
    prisma.ingredient.create({
      data: { name: "계란", category: "기타" },
    }),
    prisma.ingredient.create({
      data: { name: "김치", category: "기타" },
    }),
    // 양념류
    prisma.ingredient.create({
      data: { name: "고추장", category: "양념" },
    }),
    prisma.ingredient.create({
      data: { name: "된장", category: "양념" },
    }),
    prisma.ingredient.create({
      data: { name: "간장", category: "양념" },
    }),
    prisma.ingredient.create({
      data: { name: "참기름", category: "양념" },
    }),
  ]);

  // Create ingredient map for easier lookup
  const ingredientMap = ingredients.reduce(
    (acc, ing) => {
      acc[ing.name] = ing.id;
      return acc;
    },
    {} as Record<string, string>
  );

  // Create recipes with ingredients
  // Recipe 1: 파전 (Pajeon - Green Onion Pancake) - Uses a lot of 대파
  await prisma.recipe.create({
    data: {
      title: "파전",
      description:
        "바삭하고 쫄깃한 파전으로 대파를 한 단 다 쓸 수 있어요. 비 오는 날 막걸리와 함께 즐기기 좋습니다.",
      steps: [
        "대파를 깨끗이 씻어 5cm 길이로 잘라주세요.",
        "밀가루 1컵, 물 1컵, 계란 1개, 소금 약간을 넣고 반죽을 만들어요.",
        "팬에 기름을 두르고 반죽을 얇게 펴주세요.",
        "대파를 반죽 위에 가지런히 올려주세요.",
        "중불에서 앞뒤로 노릇하게 구워주세요.",
        "간장에 식초를 넣은 양념장과 함께 드세요.",
      ],
      time: 20,
      difficulty: Difficulty.EASY,
      tips: "남은 대파는 송송 썰어 지퍼백에 냉동 보관하면 국이나 찌개에 바로 사용할 수 있어요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["대파"], quantity: 200, unit: "g" },
          { ingredientId: ingredientMap["계란"], quantity: 1, unit: "개" },
        ],
      },
    },
  });

  // Recipe 2: 대파 된장국
  await prisma.recipe.create({
    data: {
      title: "대파 된장국",
      description:
        "대파를 듬뿍 넣어 달큰하고 구수한 된장국. 간단하지만 깊은 맛이 납니다.",
      steps: [
        "대파를 어슷하게 송송 썰어주세요.",
        "냄비에 물을 붓고 끓으면 된장을 풀어주세요.",
        "대파와 두부를 넣고 5분 더 끓여주세요.",
        "마늘을 다져 넣고 불을 꺼주세요.",
      ],
      time: 15,
      difficulty: Difficulty.EASY,
      tips: "대파 흰 부분은 국물에 단맛을, 초록 부분은 향을 더해요. 분리해서 순서대로 넣으면 더 맛있어요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["대파"], quantity: 100, unit: "g" },
          { ingredientId: ingredientMap["된장"], quantity: 1, unit: "큰술" },
          { ingredientId: ingredientMap["두부"], quantity: 100, unit: "g" },
          { ingredientId: ingredientMap["마늘"], quantity: 1, unit: "쪽" },
        ],
      },
    },
  });

  // Recipe 3: 파기름 볶음밥
  await prisma.recipe.create({
    data: {
      title: "파기름 볶음밥",
      description:
        "대파로 만든 파기름이 밥에 스며들어 고소하고 풍미 가득한 볶음밥입니다.",
      steps: [
        "대파 흰 부분을 잘게 다져주세요.",
        "팬에 기름을 넉넉히 두르고 대파를 볶아 파기름을 만들어요.",
        "밥을 넣고 센 불에서 빠르게 볶아주세요.",
        "간장과 소금으로 간을 하고 계란을 넣어 섞어주세요.",
        "대파 초록 부분을 송송 썰어 마무리해요.",
      ],
      time: 15,
      difficulty: Difficulty.EASY,
      tips: "파기름을 만들 때 대파가 갈색이 되기 직전에 밥을 넣으면 타지 않고 고소한 맛을 살릴 수 있어요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["대파"], quantity: 150, unit: "g" },
          { ingredientId: ingredientMap["계란"], quantity: 2, unit: "개" },
          { ingredientId: ingredientMap["간장"], quantity: 1, unit: "큰술" },
        ],
      },
    },
  });

  // Recipe 4: 김치찌개
  await prisma.recipe.create({
    data: {
      title: "김치찌개",
      description:
        "얼큰하고 깊은 맛의 김치찌개. 돼지고기와 두부가 들어가 든든해요.",
      steps: [
        "돼지고기를 한입 크기로 썰어주세요.",
        "냄비에 참기름을 두르고 돼지고기를 볶아주세요.",
        "김치를 넣고 함께 볶다가 물을 부어주세요.",
        "끓으면 두부와 대파를 넣고 5분 더 끓여주세요.",
        "기호에 따라 고추장을 넣어 매콤하게 조절하세요.",
      ],
      time: 25,
      difficulty: Difficulty.EASY,
      tips: "신 김치를 사용하면 더 깊은 맛이 나요. 김치 국물도 함께 넣으면 좋아요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["김치"], quantity: 200, unit: "g" },
          { ingredientId: ingredientMap["돼지고기"], quantity: 150, unit: "g" },
          { ingredientId: ingredientMap["두부"], quantity: 150, unit: "g" },
          { ingredientId: ingredientMap["대파"], quantity: 50, unit: "g" },
          { ingredientId: ingredientMap["참기름"], quantity: 1, unit: "큰술" },
        ],
      },
    },
  });

  // Recipe 5: 된장찌개
  await prisma.recipe.create({
    data: {
      title: "된장찌개",
      description: "구수한 된장과 신선한 채소가 어우러진 한식 대표 찌개입니다.",
      steps: [
        "감자, 애호박, 양파를 먹기 좋은 크기로 썰어주세요.",
        "냄비에 물을 붓고 된장을 풀어주세요.",
        "감자를 먼저 넣고 끓이다가 다른 채소를 넣어주세요.",
        "두부와 버섯을 넣고 5분 더 끓여주세요.",
        "대파와 마늘을 넣고 마무리해주세요.",
      ],
      time: 25,
      difficulty: Difficulty.EASY,
      tips: "애호박은 끓는 물에 넣어야 물러지지 않아요. 마지막에 고추를 넣으면 칼칼한 맛을 더할 수 있어요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["된장"], quantity: 2, unit: "큰술" },
          { ingredientId: ingredientMap["감자"], quantity: 1, unit: "개" },
          { ingredientId: ingredientMap["애호박"], quantity: 0.5, unit: "개" },
          { ingredientId: ingredientMap["양파"], quantity: 0.5, unit: "개" },
          { ingredientId: ingredientMap["두부"], quantity: 100, unit: "g" },
          { ingredientId: ingredientMap["버섯"], quantity: 50, unit: "g" },
          { ingredientId: ingredientMap["대파"], quantity: 30, unit: "g" },
          { ingredientId: ingredientMap["마늘"], quantity: 2, unit: "쪽" },
        ],
      },
    },
  });

  // Recipe 6: 소고기 미역국
  await prisma.recipe.create({
    data: {
      title: "소고기 미역국",
      description:
        "생일날 꼭 먹는 든든한 소고기 미역국. 참기름 향이 구수해요.",
      steps: [
        "마른 미역을 물에 불려 준비해주세요.",
        "소고기를 참기름에 볶아주세요.",
        "불린 미역을 넣고 함께 볶아주세요.",
        "물을 붓고 국간장과 마늘로 간을 해주세요.",
        "30분 이상 푹 끓여주세요.",
      ],
      time: 45,
      difficulty: Difficulty.MEDIUM,
      tips: "미역은 끓이면 많이 불어나니 처음에 적게 넣으세요. 남은 국은 밥을 말아 먹으면 별미예요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["소고기"], quantity: 100, unit: "g" },
          { ingredientId: ingredientMap["참기름"], quantity: 1, unit: "큰술" },
          { ingredientId: ingredientMap["간장"], quantity: 2, unit: "큰술" },
          { ingredientId: ingredientMap["마늘"], quantity: 2, unit: "쪽" },
        ],
      },
    },
  });

  // Recipe 7: 콩나물국
  await prisma.recipe.create({
    data: {
      title: "콩나물국",
      description: "시원하고 깔끔한 콩나물국. 숙취 해소에도 좋아요.",
      steps: [
        "콩나물을 깨끗이 씻어 준비해요.",
        "냄비에 물을 붓고 콩나물을 넣어주세요.",
        "뚜껑을 열지 말고 중불에서 10분 끓여주세요.",
        "대파와 마늘을 넣고 국간장으로 간을 해주세요.",
        "기호에 따라 계란을 풀어 넣어도 좋아요.",
      ],
      time: 15,
      difficulty: Difficulty.EASY,
      tips: "콩나물 끓일 때 뚜껑을 열면 비린내가 날 수 있으니 주의하세요!",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["콩나물"], quantity: 200, unit: "g" },
          { ingredientId: ingredientMap["대파"], quantity: 30, unit: "g" },
          { ingredientId: ingredientMap["마늘"], quantity: 2, unit: "쪽" },
          { ingredientId: ingredientMap["간장"], quantity: 1, unit: "큰술" },
        ],
      },
    },
  });

  // Recipe 8: 시금치 나물
  await prisma.recipe.create({
    data: {
      title: "시금치 나물",
      description: "고소한 참기름에 무친 시금치 나물. 반찬으로 딱이에요.",
      steps: [
        "시금치를 깨끗이 씻어 준비해요.",
        "끓는 물에 소금을 넣고 시금치를 30초간 데쳐주세요.",
        "찬물에 헹궈 물기를 꼭 짜주세요.",
        "참기름, 간장, 다진 마늘, 깨를 넣고 무쳐주세요.",
      ],
      time: 10,
      difficulty: Difficulty.EASY,
      tips: "시금치는 오래 데치면 영양소가 파괴되니 빠르게 데쳐주세요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["시금치"], quantity: 200, unit: "g" },
          { ingredientId: ingredientMap["참기름"], quantity: 1, unit: "큰술" },
          { ingredientId: ingredientMap["간장"], quantity: 0.5, unit: "큰술" },
          { ingredientId: ingredientMap["마늘"], quantity: 1, unit: "쪽" },
        ],
      },
    },
  });

  // Recipe 9: 제육볶음
  await prisma.recipe.create({
    data: {
      title: "제육볶음",
      description:
        "매콤달콤한 제육볶음. 밥도둑이라 불리는 한식 대표 반찬입니다.",
      steps: [
        "돼지고기를 먹기 좋게 썰어주세요.",
        "고추장, 간장, 설탕, 다진 마늘로 양념장을 만들어요.",
        "돼지고기에 양념을 넣고 30분 재워주세요.",
        "팬에 기름을 두르고 양파를 먼저 볶아주세요.",
        "재운 고기를 넣고 센 불에서 볶아주세요.",
        "대파를 넣고 마무리해요.",
      ],
      time: 40,
      difficulty: Difficulty.MEDIUM,
      tips: "고기는 센 불에서 빠르게 볶아야 질겨지지 않아요. 양파를 많이 넣으면 달콤해져요.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["돼지고기"], quantity: 300, unit: "g" },
          { ingredientId: ingredientMap["양파"], quantity: 1, unit: "개" },
          { ingredientId: ingredientMap["대파"], quantity: 50, unit: "g" },
          { ingredientId: ingredientMap["고추장"], quantity: 2, unit: "큰술" },
          { ingredientId: ingredientMap["간장"], quantity: 1, unit: "큰술" },
          { ingredientId: ingredientMap["마늘"], quantity: 3, unit: "쪽" },
        ],
      },
    },
  });

  // Recipe 10: 계란찜
  await prisma.recipe.create({
    data: {
      title: "계란찜",
      description: "부드럽고 폭신한 계란찜. 아이들 반찬으로도 인기 만점이에요.",
      steps: [
        "계란을 풀어 체에 걸러주세요.",
        "물이나 육수를 계란과 1:1 비율로 섞어주세요.",
        "뚝배기나 냄비에 담고 대파를 송송 썰어 넣어요.",
        "중약불에서 저어가며 익혀주세요.",
        "표면이 부풀어 오르면 완성이에요.",
      ],
      time: 15,
      difficulty: Difficulty.EASY,
      tips: "계란을 체에 거르면 더 부드러워요. 전자레인지로 3분만 돌려도 됩니다.",
      ingredients: {
        create: [
          { ingredientId: ingredientMap["계란"], quantity: 4, unit: "개" },
          { ingredientId: ingredientMap["대파"], quantity: 20, unit: "g" },
        ],
      },
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
