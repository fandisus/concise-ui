const dialogs: HTMLDialogElement[] = []
let layer = 1000

export function removeDialog(dialog: HTMLDialogElement) {
  const index = dialogs.indexOf(dialog)
  if (index !== -1) dialogs.splice(index, 1)
}

export function activateDialog(dialog: HTMLDialogElement) {
  removeDialog(dialog)
  dialogs.push(dialog)
  return ++layer
}

export function isActiveDialog(dialog: HTMLDialogElement) {
  const openDialogs = dialogs.filter((item) => item.open)
  return openDialogs[openDialogs.length - 1] === dialog
}
