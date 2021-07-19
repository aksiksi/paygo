
export enum ProgressButtonState {
    None,
    Waiting,
    Done,
}

/**
 * Simple submit button that changes its text and appearance based on the
 * passed in state.
 */
export function ProgressButton(props: {
    state: ProgressButtonState,
    baseStyle: string,
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
            extraStyle = "bg-green-200 text-white"
            buttonText = "Success!"
            isButtonDisabled = true
            break
    }

    return (
        <div>
            <button
                className={`flex items-center justify-center ${props.baseStyle} ${extraStyle}`}
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
