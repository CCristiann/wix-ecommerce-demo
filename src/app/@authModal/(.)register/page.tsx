import AuthModal from "~/components/auth/AuthModal";
import RegisterForm from "~/components/auth/RegisterForm";


export default function InterceptedRegisterPage() {
    return (
        <AuthModal path="/register">
            <RegisterForm />
        </AuthModal>
    )
}