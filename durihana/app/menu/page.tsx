import RatesGraph from '@/components/RatesGraph';
import { BottomNavigation, Header } from '@/components/atoms';
import Container from '@/components/containers/Container';

export default function Menu() {
  return (
    <Container
      header={<Header leftIcon='my' rightIcon='bell' />}
      footer={<BottomNavigation selectedItem='menu' />}
    >
      <RatesGraph />
    </Container>
  );
}
