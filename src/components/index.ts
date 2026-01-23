// Layout components
export { Header } from "./layout/Header";
export { Footer } from "./layout/Footer";
export { SkipLink } from "./layout/SkipLink";

// Logo components
export {
  CarmenLogo,
  CarmenLogoWithText,
  CarmenLogoLoading,
  CarmenLogoInline,
} from "./CarmenLogo";

// UI components
export { Button } from "./ui/Button";
export { LoadingButton } from "./ui/LoadingButton";
export { Input } from "./ui/Input";
export { Section } from "./ui/Section";
export { Card } from "./ui/Card";
export { EmptyState, NoResultsState, NoCompaniesState, NoJobsState, ErrorState } from "./ui/EmptyState";
export { ScrollReveal, StaggerReveal, animations } from "./ui/ScrollReveal";
export { ScrollProgress } from "./ui/ScrollProgress";
export {
  Skeleton,
  CardSkeleton,
  StatsSkeleton,
} from "./ui/Skeleton";

// Loading components
export {
  default as Spinner,
  DotsLoader,
  PulseLoader,
  ProgressBar,
  CenteredLoading,
  FullScreenLoading,
  InlineLoading,
  SkeletonCard,
  TableSkeleton,
  ListSkeleton,
  StatsGridSkeleton,
  CardGridSkeleton,
  LogoLoading,
  BrandedFullScreenLoading,
  type LoadingSize,
  type LoadingColor,
  type LoadingVariant,
} from "./ui/Loading";
export { LazySection } from "./ui/LazySection";
export { OptimizedImage } from "./ui/OptimizedImage";
export { ConfirmDialog } from "./ui/ConfirmDialog";
export { AutocompleteJobTitles } from "./ui/AutocompleteJobTitles";

// Keyboard navigation components
export {
  useKeyboardNav,
  useKeyboardListNav,
  useFocusTrap,
  KeyboardShortcut,
  KeyboardButton,
  KeyboardNavProvider,
  CommonShortcuts,
} from "./ui/KeyboardNav";

// Micro-interactions components
export {
  FeedbackButton,
  HoverCard,
  RippleButton,
  Shakeable,
  Tooltip,
  Pressable,
  Notification,
  StaggerChildren,
  AnimatedIcon,
  ProgressRing,
  type InteractionState,
  type AnimationType,
} from "./ui/MicroInteractions";
