import { Session } from "./deps.ts";

export class Service {
  #plugins: { [key: string]: Session };

  constructor() {
    this.#plugins = {};
  }

  static register(service: Service, name: string, session: Session): void {
    service.#plugins[name] = session;
  }

  async dispatch(name: string, fn: string, args: unknown[]): Promise<unknown> {
    try {
      const session = this.#plugins[name];
      if (!session) {
        throw new Error(`No plugin '${name}' is registered`);
      }
      return await session.call(fn, ...args);
    } catch (e) {
      // NOTE:
      // Vim/Neovim does not handle JavaScript Error instance thus use string instead
      throw `${e.stack ?? e.toString()}`;
    }
  }
}
