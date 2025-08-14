import { generate } from 'otp-generator'

export function generateOTP() {
    try {
        return generate(4, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            digits:true
        })
    } catch (error) {
        console.log(`Error generate OTP: ${error}`)
    }
}