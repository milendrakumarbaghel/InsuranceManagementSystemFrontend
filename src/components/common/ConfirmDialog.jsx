import Modal from './Modal'
import Spinner from './Spinner'

const CONFIRM_VARIANT_CLASSES = {
  danger:  'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
  default: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  const confirmClass =
    CONFIRM_VARIANT_CLASSES[variant] ?? CONFIRM_VARIANT_CLASSES.default

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="mb-6 text-sm text-gray-600">{message}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}
        >
          {isLoading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
