import BaseButton from "@/components/ui/BaseButton";

export default function Home() {
  return (
    <main>
      Hello, world!
      <BaseButton variant="outline" text={'Login'} />
      <BaseButton variant="ghost" text={'Register'} />
    </main>
  );
}
