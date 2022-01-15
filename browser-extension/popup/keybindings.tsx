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

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
export const isKeyModifier = (code: string) => {
  return code === 'AltLeft' ||
    code === 'AltRight' ||
    code === 'ControlLeft' ||
    code === 'ControlRight' ||
    code === 'MetaLeft' ||
    code === 'MetaRight' ||
    code === 'OSLeft' ||
    code === 'OSRight' ||
    code === 'ShiftLeft' ||
    code === 'ShiftRight'
}

export const eventToKeyBinding = (event: KeyboardEvent | React.KeyboardEvent): KeyBinding => {
  const keyIsModifier = isKeyModifier(event.code);

  const kb = {
    code: keyIsModifier ? undefined : event.code,
    modifiers: {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    }
  };

  return kb;
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


export const setDefaultKeybinding = async (id: KeyBindingId): Promise<void> => {
  const defaultKeyBinding = defaultKeyBindings[id];
  if (defaultKeyBinding) {
    console.log(`The keybinding ${id} is invalid. We'll reset it to default.`);
    await writeKeyBinding(id, defaultKeyBinding);
  }
}

export const setDefaultKeyBindings = async (): Promise<void> => {
  await Promise.all(Object.keys(defaultKeyBindings).map(id => setDefaultKeybinding(id as KeyBindingId)));
}

// XXX - Still quite naive validation.
export const validateKeyBinding = (kb: KeyBinding): boolean => {
  const schemeIsValid =
    (typeof kb.code === 'string') &&
    (typeof kb.modifiers === 'object') &&
    (typeof kb.modifiers.altKey === 'boolean') &&
    (typeof kb.modifiers.ctrlKey === 'boolean') &&
    (typeof kb.modifiers.metaKey === 'boolean') &&
    (typeof kb.modifiers.shiftKey === 'boolean');

  if (!schemeIsValid) {
    return false;
  }

  const noModifierSpecified = !(kb.modifiers.altKey || kb.modifiers.ctrlKey || kb.modifiers.metaKey || kb.modifiers.shiftKey);
  if (noModifierSpecified) {
    return false;
  }

  const keyIsModifier = isKeyModifier(kb);
  if (keyIsModifier) {
    return false;
  }

  return true;
}

const readKeyBindingStr = async (storageKey: KeyBindingId): Promise<string | undefined> => (await browser.storage.local.get([storageKey]))[storageKey];

export const readKeyBinding = async (id: KeyBindingId): Promise<KeyBinding | undefined> => {
  const storageKey = kbToStorage(id) as KeyBindingId;

  let serializedKb = await readKeyBindingStr(storageKey);
  let kb: KeyBinding;

  try {
    if (!serializedKb) {
      await setDefaultKeyBindings();
      serializedKb = await readKeyBindingStr(storageKey);
    }

    kb = JSON.parse(serializedKb);
    if (!validateKeyBinding(kb)) {
      await setDefaultKeyBindings();
      serializedKb = await readKeyBindingStr(storageKey);
    }
  } catch (err) {
    await setDefaultKeyBindings();
    return await readKeyBinding(id);
  }

  return kb;
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
