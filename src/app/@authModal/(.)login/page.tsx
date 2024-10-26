import AuthModal from "~/components/auth/AuthModal";
import LoginForm from "~/components/auth/LoginForm";

export default function InterceptedLoginPage() {
    return (
        <AuthModal path="/login">
            <LoginForm />
        </AuthModal>
    )
}