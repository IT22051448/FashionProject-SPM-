// likely and email or username

export const emailOrUsername = (value) => {
    if (value.includes('@')) {
        return 'email';
    }
    return 'username';
}
