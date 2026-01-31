export default function Footer() {
    return (
        <footer className="border-t border-border/70 bg-background">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <div>(c) {new Date().getFullYear()} DevConnect</div>
                <div>Built for developers</div>
            </div>
        </footer>
    );
}
