const ErrorPage = () => {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
      data-id={1}
    >
      <div className="mx-auto max-w-screen-md text-center" data-id={2}>
        <div data-id={3} className="mx-auto h-12 w-12 text-primary" />
        <h1
          className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl"
          data-id={4}
        >
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground" data-id={5}>
          We're sorry, but an unexpected error has occurred. Please try again
          later or contact support if the issue persists.
        </p>
        <div className="mt-6" data-id={6}>
          <a
            data-id={7}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href="/"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
