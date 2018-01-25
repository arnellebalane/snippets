export default {
    methods: {
        getShortcuts() {
            return {};
        },

        _keydownHandler(e) {
            const shortcuts = this.getShortcuts();

            if (e.ctrlKey && e.code in shortcuts) {
                e.preventDefault();
                shortcuts[e.code]();
            }
        }
    },

    created() {
        window.addEventListener('keydown', this._keydownHandler);
    },

    destroyed() {
        window.removeEventListener('keydown', this._keydownHandler);
    }
};
