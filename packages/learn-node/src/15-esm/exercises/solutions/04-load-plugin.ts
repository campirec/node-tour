export interface Plugin {
  name: string;
  setup(context: unknown): unknown | Promise<unknown>;
}

export type PluginImporter = (specifier: string) => Promise<unknown>;

export interface LoadPluginOptions {
  importer?: PluginImporter;
}

export function isPlugin(value: unknown): value is Plugin {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.name === 'string' &&
    candidate.name.length > 0 &&
    typeof candidate.setup === 'function'
  );
}

export async function loadPlugin(
  specifier: string,
  options: LoadPluginOptions = {},
): Promise<Plugin> {
  if (!specifier) {
    throw new RangeError('specifier 不能为空');
  }

  const importer =
    options.importer ?? ((target: string) => import(target));

  let module: unknown;
  try {
    module = await importer(specifier);
  } catch (error) {
    throw new Error(`插件加载失败：${specifier}`, { cause: error });
  }

  const candidate =
    typeof module === 'object' && module !== null && 'default' in module
      ? (module as { default: unknown }).default
      : module;

  if (!isPlugin(candidate)) {
    throw new Error('插件必须导出 { name: string, setup: function }', {
      cause: module,
    });
  }

  return candidate;
}
