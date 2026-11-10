// Original teaching scenes using artwork from the pinned Boss Fight Atlas revision.
const demonstrations = {
  'movement-platforming--t003': {
    kind: 'precision-jump',
    ru: {
      title: 'Прыжок через разрыв',
      description:
        'Игрок подходит к краю, прыгает через разрыв и приземляется в отмеченной зоне. Дуга показывает путь ног, а отметка на платформе учитывает ширину опоры игрока.',
      phases: [
        {
          title: 'Подход',
          description:
            'Подойдите к краю. Отмеченная зона показывает, куда должны попасть ноги после прыжка.',
        },
        {
          title: 'Прыжок',
          description:
            'Игрок отталкивается, пока ещё стоит на платформе. Дуга переносит его через разрыв.',
        },
        {
          title: 'Приземление',
          description:
            'Обе ноги оказываются на новой платформе. Затем игрок разворачивается и прыгает обратно.',
        },
      ],
    },
    en: {
      title: 'Jumping a gap',
      description:
        'The player approaches the edge, jumps across and lands in the marked zone. The arc traces the feet, and the mark on the platform accounts for the width of the player’s footing.',
      phases: [
        {
          title: 'Approach',
          description:
            'Move toward the edge. The marked zone shows where the player’s feet should land.',
        },
        {
          title: 'Jump',
          description:
            'The player takes off while still on the platform. The arc carries them across the gap.',
        },
        {
          title: 'Landing',
          description:
            'Both feet land on the next platform. The player then turns and jumps back.',
        },
      ],
    },
  },
  'melee-combat--t016': {
    kind: 'timed-parry',
    ru: {
      title: 'Парирование выпада',
      description:
        'Во время спарринга соперник делает выпад. Парирование срабатывает, если клинок касается защиты в короткое окно. После контакта соперник отшатывается.',
      phases: [
        {
          title: 'Замах',
          description:
            'Соперник отводит клинок перед выпадом. Пунктир показывает, куда придётся удар.',
        },
        {
          title: 'Окно защиты',
          description:
            'Игрок поднимает защиту перед контактом. Клинок достигает её, пока окно парирования открыто.',
        },
        {
          title: 'Отдача',
          description:
            'Соперник отшатывается после парирования. Это даёт игроку время на ответ.',
        },
      ],
    },
    en: {
      title: 'Parrying a thrust',
      description:
        'A sparring partner lunges. The parry succeeds if the blade meets the guard during a brief window. The opponent recoils after contact.',
      phases: [
        {
          title: 'Wind-up',
          description:
            'The opponent draws the blade back before thrusting. The dashed line shows where the strike will go.',
        },
        {
          title: 'Parry window',
          description:
            'The player raises their guard just before contact. The blade reaches it while the parry window is open.',
        },
        {
          title: 'Recoil',
          description:
            'The opponent recoils after the parry, giving the player time to respond.',
        },
      ],
    },
  },
  'stealth-infiltration--t031': {
    kind: 'line-of-sight',
    ru: {
      title: 'Как стена перекрывает обзор',
      description:
        'Охранник видит игрока перед собой, пока между ними нет стены. Луч показывает, где прерывается прямая видимость.',
      phases: [
        {
          title: 'На виду',
          description:
            'Игрок находится в секторе обзора. Луч доходит до него, и охранник его видит.',
        },
        {
          title: 'За стеной',
          description:
            'Стена перекрывает луч. Охранник смотрит в ту же сторону, но игрок скрыт.',
        },
        {
          title: 'Выход',
          description:
            'Игрок выходит из-за края стены. Как только луч снова доходит до него, охранник его видит.',
        },
      ],
    },
    en: {
      title: 'How a wall blocks sight',
      description:
        'The guard sees the player ahead while there is no wall between them. The ray shows where the line of sight breaks.',
      phases: [
        {
          title: 'In sight',
          description:
            'The player stands in the field of view. The ray reaches them, so the guard can see them.',
        },
        {
          title: 'Behind cover',
          description:
            'The wall blocks the ray. The guard faces the same way, but the player is hidden.',
        },
        {
          title: 'Reappearing',
          description:
            'The player steps out from behind the wall. The guard sees them once the ray reaches them again.',
        },
      ],
    },
  },
  'shooting-projectiles--t029': {
    kind: 'independent-aim',
    ru: {
      title: 'Стрельба на отступлении',
      description:
        'Игрок отступает влево, сохраняя прицел вправо. Стрелка у ног показывает движение, а линия от оружия показывает направление выстрела.',
      phases: [
        {
          title: 'Прицел',
          description: 'Игрок направляет оружие на соперника, стоя на месте.',
        },
        {
          title: 'Отступление',
          description:
            'Игрок идёт влево и стреляет вправо. Каждый снаряд вылетает из текущего положения оружия.',
        },
        {
          title: 'Остановка',
          description:
            'Игрок останавливается. Направление прицела остаётся прежним.',
        },
      ],
    },
    en: {
      title: 'Firing while retreating',
      description:
        'The player retreats to the left while aiming right. The arrow at their feet shows movement, and the line from the weapon shows the direction of fire.',
      phases: [
        {
          title: 'Aim',
          description: 'The player aims at the opponent while standing still.',
        },
        {
          title: 'Retreat',
          description:
            'The player moves left and fires right. Each shot leaves the weapon at its current position.',
        },
        {
          title: 'Stop',
          description:
            'The player stops moving. The aim direction stays the same.',
        },
      ],
    },
  },
  'social-cooperation--t204': {
    kind: 'asymmetric-roles',
    ru: {
      title: 'Один держит мост, другой проходит',
      description:
        'Напарник занимает нажимную плиту и удерживает мост открытым. Игрок пересекает разрыв, пока напарник остаётся на плите.',
      phases: [
        {
          title: 'Плита',
          description:
            'Игрок ждёт у разрыва. Напарник подходит к плите, которая выдвигает мост.',
        },
        {
          title: 'Переход',
          description:
            'Мост выдвинут. Напарник остаётся на плите, пока игрок переходит на другую сторону.',
        },
        {
          title: 'Возврат',
          description:
            'Игрок возвращается по мосту. Только после этого напарник сходит с плиты, и мост убирается.',
        },
      ],
    },
    en: {
      title: 'One holds the bridge, one crosses',
      description:
        'A partner stands on a pressure plate to hold the bridge open. The player crosses the gap while the partner stays on the plate.',
      phases: [
        {
          title: 'Pressure plate',
          description:
            'The player waits at the gap. The partner approaches the plate that extends the bridge.',
        },
        {
          title: 'Crossing',
          description:
            'The bridge is extended. The partner stays on the plate while the player crosses to the other side.',
        },
        {
          title: 'Return',
          description:
            'The player crosses back. The partner then steps off the plate and the bridge retracts.',
        },
      ],
    },
  },
};

export const demonstrationIds = Object.freeze(Object.keys(demonstrations));

export function getMechanicDemonstration(id, lang) {
  const demonstration = demonstrations[id];
  const localized = demonstration?.[lang];
  if (!localized) return null;
  return {
    kind: demonstration.kind,
    ...localized,
    sourceUrl:
      'https://github.com/polyakovin/gamedev-boss-fights/tree/08a279e424d5dd287725e5b3d044187b62267306',
    credit: 'polyakovin and contributors',
    license: 'CC-BY-4.0',
    changes:
      lang === 'ru'
        ? 'Персонажи, риг и фон из Boss Fight Atlas. Сцена и правила разработаны для gamemechanics.pro.'
        : 'Characters, rig and backdrop from Boss Fight Atlas. The scene and rules were made for gamemechanics.pro.',
    updatedAt: '2026-11-10',
  };
}
