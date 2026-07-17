export type RouteProfile = 'high' | 'balanced' | 'low';
export type RouteMotion = 'none' | 'horizontal' | 'vertical' | 'blink';

export interface RoutePlatformPlacement {
  id: string;
  routeIndex: 0 | 1 | 2;
  kind: 'support' | 'answer';
  x: number;
  y: number;
  width: number;
  height: number;
  motion: RouteMotion;
  profile: RouteProfile;
  answerIndex?: 0 | 1 | 2;
}

export interface HazardPlacement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RouteJump {
  fromX: number;
  fromTop: number;
  toX: number;
  toTop: number;
}

export interface RouteLayout {
  spawn: { x: number; y: number };
  supportPlatforms: readonly RoutePlatformPlacement[];
  answerPlatforms: readonly RoutePlatformPlacement[];
  hazards: readonly HazardPlacement[];
  routes: readonly (readonly RouteJump[])[];
}

const ANSWER_X = [210, 600, 990] as const;
const PROFILES = ['high', 'balanced', 'low'] as const;
const GROUND_TOP = 620;

function supportCount(levelId: number): number {
  if (levelId <= 2) return 2;
  if (levelId <= 6) return 3;
  return 4;
}

function answerCenterY(profile: RouteProfile): number {
  if (profile === 'high') return 280;
  if (profile === 'balanced') return 310;
  return 340;
}

function supportWidth(levelId: number, profile: RouteProfile): number {
  if (levelId <= 2) return 132;
  if (levelId <= 6) return profile === 'high' ? 88 : profile === 'balanced' ? 106 : 126;
  return profile === 'high' ? 76 : profile === 'balanced' ? 92 : 112;
}

function motionFor(levelId: number, routeIndex: number, stepIndex: number): RouteMotion {
  if (levelId <= 2) return 'none';
  if (levelId === 3) return stepIndex === 1 ? 'horizontal' : 'none';
  if (levelId === 4) return stepIndex === 1 ? 'vertical' : 'none';
  if (levelId <= 6) return (routeIndex + stepIndex) % 2 === 0 ? 'horizontal' : 'vertical';
  if ((routeIndex + stepIndex + levelId) % 3 === 0) return 'blink';
  return (routeIndex + stepIndex) % 2 === 0 ? 'horizontal' : 'vertical';
}

function makeHazards(levelId: number): readonly HazardPlacement[] {
  if (levelId <= 2) return [];
  const xs = levelId <= 6 ? [365, 835] : [300, 475, 725, 900];
  return xs.map((x, index) => ({ id: `hazard-${index}`, x, y: 602, width: 34, height: 36 }));
}

export function isRouteJumpReachable(jump: RouteJump): boolean {
  const horizontalDistance = Math.abs(jump.toX - jump.fromX);
  const upwardDistance = jump.fromTop - jump.toTop;
  return horizontalDistance <= 245 && upwardDistance <= 155;
}

export function wrapPlatformLabel(text: string, maxCharacters = 11): string {
  const characters = Array.from(text);
  const lines: string[] = [];
  for (let index = 0; index < characters.length; index += maxCharacters) {
    lines.push(characters.slice(index, index + maxCharacters).join(''));
  }
  return lines.join('\n');
}

export function buildRouteLayout(levelId: number, rotation: number): RouteLayout {
  if (!Number.isInteger(levelId) || levelId < 1 || levelId > 9) {
    throw new Error(`Unknown route level ${levelId}`);
  }
  const count = supportCount(levelId);
  const supportPlatforms: RoutePlatformPlacement[] = [];
  const answerPlatforms: RoutePlatformPlacement[] = [];
  const routes: RouteJump[][] = [];

  for (const answerIndex of [0, 1, 2] as const) {
    const routeIndex = answerIndex;
    const profile = PROFILES[(answerIndex + rotation) % PROFILES.length]!;
    const answerY = answerCenterY(profile);
    const answerTop = answerY - 24;
    const routeSurfaces: Array<{ x: number; top: number }> = [{ x: 600, top: GROUND_TOP }];

    for (let stepIndex = 0; stepIndex < count; stepIndex += 1) {
      const progress = (stepIndex + 1) / (count + 1);
      const direction = answerIndex === 0 ? -1 : answerIndex === 2 ? 1 : 0;
      const zigzag = direction === 0 && stepIndex % 2 === 0 ? (profile === 'high' ? 48 : -42) : 0;
      const x = 600 + (ANSWER_X[answerIndex] - 600) * progress + zigzag;
      const top = GROUND_TOP + (answerTop - GROUND_TOP) * progress;
      const platform: RoutePlatformPlacement = {
        id: `route-${answerIndex}-step-${stepIndex}`,
        routeIndex,
        kind: 'support',
        x: Math.round(x),
        y: Math.round(top + 12),
        width: supportWidth(levelId, profile),
        height: 24,
        motion: motionFor(levelId, routeIndex, stepIndex),
        profile,
      };
      supportPlatforms.push(platform);
      routeSurfaces.push({ x: platform.x, top });
    }

    const answer: RoutePlatformPlacement = {
      id: `answer-${answerIndex}`,
      routeIndex,
      kind: 'answer',
      x: ANSWER_X[answerIndex],
      y: answerY,
      width: 220,
      height: 48,
      motion: 'none',
      profile,
      answerIndex,
    };
    answerPlatforms.push(answer);
    routeSurfaces.push({ x: answer.x, top: answerTop });
    routes.push(routeSurfaces.slice(1).map((surface, index) => ({
      fromX: routeSurfaces[index]!.x,
      fromTop: routeSurfaces[index]!.top,
      toX: surface.x,
      toTop: surface.top,
    })));
  }

  return {
    spawn: { x: 600, y: 550 },
    supportPlatforms,
    answerPlatforms,
    hazards: makeHazards(levelId),
    routes,
  };
}
