import RegisterForm from "@/components/form-new-user"
import { useCardModal } from "@/hooks/use-card-modal"
import { Modal } from "../ui/modal"

export function ModalNewUser() {

    const handleModal = useCardModal();
    return (
        <Modal
            isOpen={handleModal.isOpen}
            onClose={handleModal.onClose}
            title="Criar usuario"
            description="Certifique-se de não utilizar um endereço de e-mail que já está em uso."
        >
            <RegisterForm />
        </Modal>
    )
}
