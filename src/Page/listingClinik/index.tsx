import FAQSection from "../../components/shared_component/Faq"
import Healthcare from "./_components/Healthcare"
import ListYourClinic from "./_components/ListYourClinic"

const ListingPage = () => {
  return (
    <div className="space-y-20 mt-24">
        <ListYourClinic />
        <Healthcare />
        <FAQSection />
    </div>
  )
}

export default ListingPage