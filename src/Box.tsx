type Props = {
  handleSelection?: (index: number) => void;
  index: number;
  selected: Player | null;
};
export default function Box({ handleSelection, index, selected }: Props) {
  let color = "";

  if (selected === "One") {
    color = "border-first bg-first/70 hover:bg-first/60";
  } else if (selected === "Two") {
    color = "border-purple-500 bg-purple-500/80 hover:bg-purple-500/60";
  } else {
    color = "border-stone-500 hover:bg-stone-500/30";
  }

  return (
    <div
      className={`aspect-square border ${
        handleSelection ? "cursor-pointer" : "cursor-not-allowed"
      } flex items-center justify-center ${color} text-4xl relative after:absolute after:inset-2 after:bg-red-300 after:rounded-full after:z-10 after:hidden`}
      onClick={handleSelection ? () => handleSelection(index) : undefined}
    >
      <span className='animate-pulse z-20'>
        {selected === "One" ? "🚀" : selected === "Two" ? "🎉" : ""}
      </span>
    </div>
  );
}
