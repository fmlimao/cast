var App = new Vue({
    el: '#AppVue',
    data: {
        formLogin: {
            disabled: false,
            error: false,
            messages: [],
            fields: {
                email: {
                    value: '',
                    error: false,
                    messages: [],
                },
                password: {
                    value: '',
                    error: false,
                    messages: [],
                },
            },
        },
        formResetPassword: {
            disabled: false,
            error: false,
            messages: [],
            fields: {
                password: {
                    value: '',
                    error: false,
                    messages: [],
                },
                passwordConfirm: {
                    value: '',
                    error: false,
                    messages: [],
                },
            },
        },
        formForgotPassword: {
            disabled: false,
            error: false,
            messages: [],
            fields: {
                email: {
                    value: '',
                    error: false,
                    messages: [],
                },
            },
        },
        formRegister: {
            disabled: false,
            error: false,
            messages: [],
            fields: {
                name: {
                    value: '',
                    error: false,
                    messages: [],
                },
                email: {
                    value: '',
                    error: false,
                    messages: [],
                },
                password: {
                    value: '',
                    error: false,
                    messages: [],
                },
                passwordConfirm: {
                    value: '',
                    error: false,
                    messages: [],
                },
            },
        },
    },
    methods: {

        clearForm: function (formName) {
            App[formName].disabled = false;
            App[formName].error = false;
            App[formName].messages = [];

            for (var field in App[formName].fields) {
                App[formName].fields[field].value = App[formName].fields[field].value.trim();
                App[formName].fields[field].error = false;
                App[formName].fields[field].messages = [];
            }
        },

        populateForm: function (formName, response) {
            App[formName].disabled = false;
            App[formName].error = response.error;
            App[formName].messages = response.messages;

            for (var field in App[formName].fields) {
                if (typeof response.form[field] !== 'undefined') {
                    App[formName].fields[field].error = response.form[field].error;
                    App[formName].fields[field].messages = response.form[field].messages;
                }
            }
        },

        submitFormLogin: function () {
            App.clearForm('formLogin');

            var callback = function (response) {
                if (response.error) {
                    App.populateForm('formLogin', response);

                    if (typeof response.content.resetPasswordUrl !== 'undefined') {
                        var hash = response.content.resetPasswordUrl.hash;
                        setTimeout(function () {
                            window.location.replace(`/reset-password/${hash}`);
                        }, 1000);
                    }
                } else {
                    App.saveSession(response.content.token);
                }
            };

            var error = false;

            if (!App.formLogin.fields.email.value) {
                error = true;
                App.formLogin.fields.email.error = true;
                App.formLogin.fields.email.messages.push('Campo obrigatório.')
            }

            if (!App.formLogin.fields.password.value) {
                error = true;
                App.formLogin.fields.password.error = true;
                App.formLogin.fields.password.messages.push('Campo obrigatório.')
            }

            if (error) {
                App.formLogin.error = true;
                App.formLogin.messages.push('Verifique todos os campos.')
                return;
            }

            App.formLogin.disabled = true;

            axios.post(`${apiHost}/auth`, {
                email: App.formLogin.fields.email.value,
                password: App.formLogin.fields.password.value,
            })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (error) {
                    callback(error.response.data);
                });
        },

        submitFormResetPassword: function () {
            App.clearForm('formResetPassword');

            var callback = function (response) {
                if (response.error) {
                    App.populateForm('formResetPassword', response);
                } else {
                    window.location.replace('/login');
                }
            };

            var error = false;

            if (!App.formResetPassword.fields.password.value) {
                error = true;
                App.formResetPassword.fields.password.error = true;
                App.formResetPassword.fields.password.messages.push('Campo obrigatório.')
            }

            if (!App.formResetPassword.fields.passwordConfirm.value) {
                error = true;
                App.formResetPassword.fields.passwordConfirm.error = true;
                App.formResetPassword.fields.passwordConfirm.messages.push('Campo obrigatório.')
            }

            if (
                App.formResetPassword.fields.password.value
                && App.formResetPassword.fields.passwordConfirm.value
                && App.formResetPassword.fields.password.value !== App.formResetPassword.fields.passwordConfirm.value
            ) {
                error = true;
                App.formResetPassword.fields.passwordConfirm.error = true;
                App.formResetPassword.fields.passwordConfirm.messages.push('As senhas não combinam.')
            }

            if (error) {
                App.formResetPassword.error = true;
                App.formResetPassword.messages.push('Verifique todos os campos.')
                return;
            }

            App.formResetPassword.disabled = true;

            axios.post(`${apiHost}/auth/reset-password/${hash}`, {
                password: App.formResetPassword.fields.password.value,
            })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (error) {
                    callback(error.response.data);
                });
        },

        submitFormForgotPassword: function () {
            App.clearForm('formForgotPassword');

            var callback = function (response) {
                if (response.error) {
                    App.populateForm('formForgotPassword', response);
                } else {
                    App.populateForm('formForgotPassword', response);
                    // window.location.replace('/login');
                }
            };

            var error = false;

            if (!App.formForgotPassword.fields.email.value) {
                error = true;
                App.formForgotPassword.fields.email.error = true;
                App.formForgotPassword.fields.email.messages.push('Campo obrigatório.')
            }

            if (error) {
                App.formForgotPassword.error = true;
                App.formForgotPassword.messages.push('Verifique todos os campos.')
                return;
            }

            App.formForgotPassword.disabled = true;

            axios.post(`${apiHost}/auth/forgot-password`, {
                email: App.formForgotPassword.fields.email.value,
            })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (error) {
                    callback(error.response.data);
                });
        },

        submitFormRegister: function () {
            App.clearForm('formRegister');

            var callback = function (response) {
                if (response.error) {
                    App.populateForm('formRegister', response);
                } else {
                    App.populateForm('formRegister', response);

                    setTimeout(function () {
                        window.location.replace('/login');
                    }, 1000);
                }
            };

            var error = false;

            if (!App.formRegister.fields.name.value) {
                error = true;
                App.formRegister.fields.name.error = true;
                App.formRegister.fields.name.messages.push('Campo obrigatório.')
            }

            if (!App.formRegister.fields.email.value) {
                error = true;
                App.formRegister.fields.email.error = true;
                App.formRegister.fields.email.messages.push('Campo obrigatório.')
            }

            if (!App.formRegister.fields.password.value) {
                error = true;
                App.formRegister.fields.password.error = true;
                App.formRegister.fields.password.messages.push('Campo obrigatório.')
            }

            if (!App.formRegister.fields.passwordConfirm.value) {
                error = true;
                App.formRegister.fields.passwordConfirm.error = true;
                App.formRegister.fields.passwordConfirm.messages.push('Campo obrigatório.')
            }

            if (
                App.formRegister.fields.password.value
                && App.formRegister.fields.passwordConfirm.value
                && App.formRegister.fields.password.value !== App.formRegister.fields.passwordConfirm.value
            ) {
                error = true;
                App.formRegister.fields.passwordConfirm.error = true;
                App.formRegister.fields.passwordConfirm.messages.push('As senhas não combinam.')
            }

            if (error) {
                App.formRegister.error = true;
                App.formRegister.messages.push('Verifique todos os campos.')
                return;
            }

            App.formRegister.disabled = true;

            axios.post(`${apiHost}/auth/register`, {
                name: App.formRegister.fields.name.value,
                email: App.formRegister.fields.email.value,
                password: App.formRegister.fields.password.value,
            })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (error) {
                    callback(error.response.data);
                });
        },

        saveSession: function (token) {
            var callback = function (response) {
                if (response.error) {
                    App.formLogin.error = true;
                    App.formLogin.messages.push('Ocorreu um erro inesperado. Por favor atualize a página e tente novamente.');
                } else {
                    window.location.replace('/');
                }
            };

            axios.post(`/save-session`, {
                token,
            })
                .then(function (response) {
                    callback(response.data);
                })
                .catch(function (error) {
                    callback(error.response.data);
                });
        },

    },
});
