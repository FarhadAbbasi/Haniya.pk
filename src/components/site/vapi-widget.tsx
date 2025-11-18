import React from 'react'

function vapiWidget() {
    return (
        <div>
            <vapi-widget
                mode="voice"
                assistant-id="32894288-f0ee-497a-b70f-1995b0e9ae1e"
                public-key="0c3f797a-7375-45e7-8834-6bc0bb87414a"
            ></vapi-widget>
            <script src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js" async type="text/javascript"></script>

        </div >
    )
}

export default vapiWidget