// Each descriptor follows the corresponding deterministic demonstration model.
// Character artwork and the shared rig come from Boss Fight Atlas; see the notice.
const demonstrations = {
  'boss-fight-atlas--boss-charge': {
    kind: 'charge',
    ru: {
      title: 'Таран по прямой',
      description:
        'Босс выбирает направление, фиксирует его и делает рывок. Игрок успевает выйти из полосы всем телом. После рывка боссу нужно время на восстановление.',
      phases: [
        {
          title: 'Прицеливание',
          description:
            'Сначала босс следит за игроком. Когда направление зафиксировано, игрок уходит поперёк полосы будущего рывка.',
        },
        {
          title: 'Таран',
          description:
            'Босс движется по выбранной прямой. Направление уже не меняется, а игрок находится целиком за пределами полосы.',
        },
        {
          title: 'Восстановление',
          description:
            'Босс останавливается и восстанавливается. Затем оба персонажа возвращаются на исходные места.',
        },
      ],
    },
    en: {
      title: 'A charge along a fixed line',
      description:
        'The boss aims, locks its direction and charges. The player has time to move their whole body out of the lane. The boss needs time to recover afterward.',
      phases: [
        {
          title: 'Aiming',
          description:
            'The boss tracks the player at first. Once the direction locks, the player moves across the lane of the upcoming charge.',
        },
        {
          title: 'Charge',
          description:
            'The boss follows the chosen line without steering. The player is entirely outside the lane.',
        },
        {
          title: 'Recovery',
          description:
            'The boss stops and recovers. Both characters then return to their starting positions.',
        },
      ],
    },
  },
  'boss-fight-atlas--boss-sweep': {
    kind: 'sweep',
    ru: {
      title: 'Размашистый удар',
      description:
        'Оружие проходит по дуге вокруг босса. Игрок выходит за внешний край удара до прохода лезвия. Опасная область следует за оружием.',
      phases: [
        {
          title: 'Замах',
          description:
            'Босс готовит оружие к удару. Разметка показывает его досягаемость, и игрок отходит за внешний край.',
        },
        {
          title: 'Взмах',
          description:
            'Лезвие проходит по дуге. В этой сцене игрок целиком находится за пределами досягаемости оружия.',
        },
        {
          title: 'Восстановление',
          description:
            'Босс завершает движение оружия и возвращается в готовую стойку. Игрок возвращается после окончания удара.',
        },
      ],
    },
    en: {
      title: 'A sweeping strike',
      description:
        'The weapon follows an arc around the boss. The player moves beyond its outer reach before the blade passes. The active threat follows the weapon.',
      phases: [
        {
          title: 'Wind-up',
          description:
            'The boss prepares the weapon. The warning shows its reach, and the player moves beyond the outer edge.',
        },
        {
          title: 'Sweep',
          description:
            'The blade travels along the arc. In this scene, the player is entirely beyond the weapon’s reach.',
        },
        {
          title: 'Recovery',
          description:
            'The boss follows through and returns to a ready stance. The player returns after the strike ends.',
        },
      ],
    },
  },
  'boss-fight-atlas--boss-ground-slam': {
    kind: 'ground-slam',
    ru: {
      title: 'Удар по земле',
      description:
        'После контакта с землёй от точки удара расходится кольцевая волна. В этом примере её радиус ограничен, поэтому игрок может заранее выйти за пределы досягаемости.',
      phases: [
        {
          title: 'Подготовка',
          description:
            'Босс готовится обрушиться на землю. Игрок отходит за отмеченную границу распространения волны.',
        },
        {
          title: 'Удар и волна',
          description:
            'Контакт с землёй запускает волну. Она расходится от точки удара, а игрок остаётся целиком за её максимальным радиусом.',
        },
        {
          title: 'Восстановление',
          description:
            'Волна затухает. Босс выпрямляется, и игрок возвращается на исходное место.',
        },
      ],
    },
    en: {
      title: 'A ground slam',
      description:
        'A ring-shaped wave spreads from the impact point after ground contact. Its reach is limited in this example, so the player can move beyond it in advance.',
      phases: [
        {
          title: 'Preparation',
          description:
            'The boss prepares to slam the ground. The player moves beyond the marked limit of the wave.',
        },
        {
          title: 'Impact and wave',
          description:
            'Ground contact starts the wave. It expands from the impact point while the player remains entirely beyond its maximum radius.',
        },
        {
          title: 'Recovery',
          description:
            'The wave fades. The boss straightens up, and the player returns to the starting position.',
        },
      ],
    },
  },
  'boss-fight-atlas--boss-summon': {
    kind: 'summon',
    ru: {
      title: 'Призыв помощников',
      description:
        'Босс заранее показывает места появления помощников. Два помощника выходят по очереди и сходятся к прежнему месту игрока, пока он перемещается в свободную часть арены.',
      phases: [
        {
          title: 'Порталы',
          description:
            'Отметки показывают, откуда появятся помощники. Игрок выбирает свободную сторону и начинает перемещение.',
        },
        {
          title: 'Призыв',
          description:
            'Помощники появляются с задержкой друг относительно друга, идут каждый от своего портала и останавливаются по прибытии.',
        },
        {
          title: 'Перестроение',
          description:
            'Помощники растворяются, затем игрок возвращается. В следующем цикле места их появления снова видны заранее.',
        },
      ],
    },
    en: {
      title: 'Summoning helpers',
      description:
        'The boss reveals where helpers will appear. Two helpers emerge one after another and converge on the player’s former position while the player moves to the open side of the arena.',
      phases: [
        {
          title: 'Portals',
          description:
            'Markers show where the helpers will appear. The player chooses an open side and starts moving.',
        },
        {
          title: 'Summon',
          description:
            'Helpers appear at staggered intervals. Each walks from its own portal and stops on arrival.',
        },
        {
          title: 'Repositioning',
          description:
            'The helpers dissolve before the player returns. Their spawn locations are shown again before the next cycle.',
        },
      ],
    },
  },
  'boss-fight-atlas--boss-gap-volley': {
    kind: 'gap-volley',
    ru: {
      title: 'Залп с проходом',
      description:
        'В рядах снарядов оставлен проход шире персонажа. Игрок занимает его до подлёта снарядов. Во втором залпе проход смещается, и маршрут меняется вместе с ним.',
      phases: [
        {
          title: 'Выбор прохода',
          description:
            'Разметка показывает занятые полосы и свободный проход. Игрок успевает переместиться в него до подлёта снарядов.',
        },
        {
          title: 'Залп',
          description:
            'Ряды снарядов проходят по обе стороны от игрока. Он остаётся внутри прохода всем телом, пока не пройдёт последний ряд.',
        },
        {
          title: 'Восстановление',
          description:
            'После обоих залпов снарядов на арене не остаётся. Игрок возвращается, и последовательность начинается снова.',
        },
      ],
    },
    en: {
      title: 'A volley with a gap',
      description:
        'The projectile rows leave a gap wider than the player. The player enters it before the projectiles arrive. The gap shifts for the second volley, changing the route.',
      phases: [
        {
          title: 'Finding the gap',
          description:
            'The warning shows occupied lanes and an open gap. The player has time to enter it before the projectiles arrive.',
        },
        {
          title: 'Volley',
          description:
            'Projectile rows pass on either side of the player. The player keeps their whole body inside the gap until the final row passes.',
        },
        {
          title: 'Recovery',
          description:
            'After both volleys, no projectiles remain in the arena. The player returns, and the sequence starts again.',
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
    sourceUrl: `https://polyakovin.github.io/boss-fight-atlas/${lang}/mechanics/${demonstration.kind}/`,
    credit: 'Boss Fight Atlas · polyakovin and contributors',
    license: 'CC-BY-4.0',
    changes:
      lang === 'ru'
        ? 'Персонажи и арена из Boss Fight Atlas; сценарии, геометрия и объяснения адаптированы для gamemechanics.pro.'
        : 'Characters and arena from Boss Fight Atlas; timelines, geometry and explanations adapted for gamemechanics.pro.',
    updatedAt: '2026-11-10',
  };
}
