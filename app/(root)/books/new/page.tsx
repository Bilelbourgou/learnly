import UploadForm from '@/components/UploadForm'
const page = () => {
  return (
    <main className="wrapper container">
      <div className="mx-auto max-w-180 space-y-10">
        <section className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold">Create a new book</h1>
            <p className="text-muted-foreground">Upload a PDF file to create a new book</p>
        </section>
        <UploadForm />
    </div>
    </main>
  )
}

export default page