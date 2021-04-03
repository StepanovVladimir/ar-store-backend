import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

export abstract class AuthInterface {
    abstract signUp(signUpDto: SignUpDto): Promise<{ id: number }>
    abstract signIn(signInDto: SignInDto): Promise<{ accessToken: string }>
}