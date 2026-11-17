/**
 * 练习题与参考答案共用同一组测试。
 *
 * - 默认：测试加载 exercise.ts（初始为 TODO，测试呈红色）。
 * - `pnpm test:solutions`：设置 LEARN_TARGET=solution，测试加载 solutions/*.ts。
 *
 * 这样可以用同一份测试验证题面与参考答案，避免答案与测试脱节。
 */
export interface ExercisePair<T> {
  exercise: () => Promise<T>;
  solution: () => Promise<T>;
}

export async function loadImpl<T>(pair: ExercisePair<T>): Promise<T> {
  return process.env.LEARN_TARGET === 'solution'
    ? pair.solution()
    : pair.exercise();
}
