import browser from 'webextension-polyfill';

const storageKeyPrefix = 'haskell-spotlight-keybinding-';
const kbToStorage = (keybindingId: string) => `${storageKeyPrefix}${keybindingId}`;

export type KeyBinding = {
  code: undefined | string,
  modifiers: KeyModifiers
}

export type KeyModifiers = {
  shiftKey: boolean,
  ctrlKey: boolean,
  altKey: boolean,
  metaKey: boolean
}

export type KeyBindingsStorageKeys = Record<string, string>

export type KeyBindingId = 'toggleSpotlight';

export const defaultKeyBindings: Record<KeyBindingId, KeyBinding> = {
  toggleSpotlight: {
    code: 'KeyH',
    modifiers: {
      shiftKey: false,
      ctrlKey: false,
      altKey: true,
      metaKey: false
    }
  }
}

export const eventToKeyBinding = (event: React.KeyboardEvent, ignoreValidation?: boolean): k.KeyBinding => {
  const noModifierSpecified = !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)

  const keyIsModifier =
    event.key === 'Alt' ||
    event.key === 'Control' ||
    event.key === 'Meta' ||
    event.key === 'Shift';

  if (!ignoreValidation && (noModifierSpecified || keyIsModifier)) {
    return undefined;
  }

  return {
    code: keyIsModifier ? undefined : event.code,
    modifiers: {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    }
  };
}

export const eqKeyBindings = (kb1: KeyBinding, kb2: KeyBinding): boolean => {
  return (
    kb1.code === kb2.code &&
    kb1.modifiers.altKey === kb2.modifiers.altKey &&
    kb1.modifiers.ctrlKey === kb2.modifiers.ctrlKey &&
    kb1.modifiers.metaKey === kb2.modifiers.metaKey &&
    kb1.modifiers.shiftKey === kb2.modifiers.shiftKey
  );
}


export const resetKeyBinding = async (id: KeyBindingId): Promise<void> => {
  const defaultKeyBinding = defaultKeyBindings[id];
  if (defaultKeyBinding) {
    console.log(`The keybinding ${id} is invalid. We'll reset it to default.`);
    await writeKeyBinding(id, defaultKeyBinding);
  }
}

export const resetKeyBindings = async (): Promise<void> => {
  await Promise.all(Object.keys(defaultKeyBindings).map(id => resetKeyBinding(id)));
}

// XXX - Very naive validation.
export const validateKeybinding = (kb: KeyBinding): boolean => {
  const isValid =
    (typeof kb.code === 'string') &&
    (typeof kb.modifiers === 'object') &&
    (typeof kb.modifiers.altKey === 'boolean') &&
    (typeof kb.modifiers.ctrlKey === 'boolean') &&
    (typeof kb.modifiers.metaKey === 'boolean') &&
    (typeof kb.modifiers.shiftKey === 'boolean');

  return isValid;
}

export const readKeyBinding = async (id: KeyBindingId): Promise<KeyBinding | undefined> => {
  const storageKey = kbToStorage(id);
  let keybinding: KeyBinding | undefined;

  try {
    keybinding = JSON.parse((await browser.storage.local.get(storageKey))[storageKey]);
    if (!validateKeybinding(keybinding)) {
      await resetKeyBindings();
      return (await readKeyBinding(id));
    }
  } catch (err) {
    console.log(err);
    await resetKeyBinding(id);
  } finally {
    return keybinding;
  }
}

export const writeKeyBinding = async (id: KeyBindingId, kb: KeyBinding): Promise<void> => {
  const storageKey = kbToStorage(id);
  let jsonStr = '';
  try {
    jsonStr = JSON.stringify(kb);
  } catch (err) {
    console.log(err);
  }

  await browser.storage.local.set({ [storageKey]: jsonStr });
}
