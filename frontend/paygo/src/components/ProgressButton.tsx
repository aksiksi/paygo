
export enum ProgressButtonState {
    None,
    Waiting,
    Done,
    Failed,
}

/**
 * Simple submit button that changes its text and appearance based on the
 * passed in state.
 */
export function ProgressButton(props: {
    state: ProgressButtonState,
    disabled: boolean,
    onClick: any,
}) {
    let extraStyle: string
    let buttonText: string
    let spinAnimation = false
    let isButtonDisabled: boolean = props.disabled

    switch (props.state) {
        case ProgressButtonState.None:
            if (isButtonDisabled) {
                extraStyle = "bg-gray-500 text-white"
            } else {
                extraStyle = "bg-yellow-500 text-white"
            }

            buttonText = "Pay"
            break
        case ProgressButtonState.Waiting:
            extraStyle = "bg-gray-500 text-white"
            buttonText = "Processing..."
            spinAnimation = true
            isButtonDisabled = true
            break
        case ProgressButtonState.Done:
            extraStyle = "bg-green-400 text-white"
            buttonText = "Success!"
            isButtonDisabled = true
            break
        case ProgressButtonState.Failed:
            extraStyle = "bg-red-400 text-white"
            buttonText = "Retry"
            break
    }

    return (
        <div>
            <button
                className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-xl ${extraStyle}`}
                type="submit"
                onClick={props.onClick}
                disabled={isButtonDisabled}
            >
                { spinAnimation && <div className="animate-spin submit-progress-circle w-4 h-4 mr-1"></div> }
                { buttonText }
            </button>
        </div>
    )
}
