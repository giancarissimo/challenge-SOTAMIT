import { Link } from "react-router-dom"

const ErrorPage = () => {
  return (
    <section className="w-full flex flex-col justify-center items-center text-center">
      <h1 className="mb-4 text-5xl font-bold">The page you’re looking <br />for can’t be found.</h1>
      <nav>
        <Link to='/'>
          <button className="cursor-pointer text-sky-500 hover:underline">Back to home</button>
        </Link>
      </nav>
    </section>
  );
};

export default ErrorPage;
