import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServices } from '../../../../redux/services/servicesOperations';
import { selectGetAllServices } from '../../../../redux/services/servicesSelectors';
import { updateOrderByNumber } from '../../../../redux/orders/ordersOperations';

import {
  ServicesContainer,
  Header,
  PartTitle,
  AddServices,
  ServicesSelect,
  ServicesTextField,
  TableWrapper,
  Table,
  TableHead,
  TableRow,
  TableNameHeader,
  TableHeader,
  TableData,
  AmountInput,
  DeleteBtn,
  DeleteIcon,
} from './OrderServices.styled';

export const OrderServices = ({ services, orderNumber }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputRef, setInputRef] = useState(null);
  const allServices = useSelector(selectGetAllServices);
  const dispatch = useDispatch();

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  const handleAddService = service => {
    if (
      !services.some(existingService => existingService._id === service._id)
    ) {
      const updatedServices = [...services, service];
      dispatch(
        updateOrderByNumber({
          number: orderNumber,
          data: { services: updatedServices },
        })
      );
    }
  };

  const handleDeleteService = serviceId => {
    const updatedServices = services.filter(
      preService => preService._id !== serviceId
    );
    const confirmDelete = window.confirm(
      'Ви впевнені, що хочете видалити послугу?'
    );
    if (confirmDelete) {
      dispatch(
        updateOrderByNumber({
          number: orderNumber,
          data: { services: updatedServices },
        })
      );
    }
  };

  const handleChangeAmount = (serviceId, newAmount) => {
    const updatedServices = services.map(service => {
      if (service._id === serviceId) {
        return { ...service, amount: newAmount };
      }
      return service;
    });
    dispatch(
      updateOrderByNumber({
        number: orderNumber,
        data: { services: updatedServices },
      })
    );
  };

  return (
    <ServicesContainer>
      <Header>
        <PartTitle>Послуги:</PartTitle>
        <AddServices>
          <ServicesSelect
            options={filteredServices}
            getOptionKey={option => option._id}
            getOptionLabel={service => `${service.name}. ${service.price}грн`}
            value={null}
            onChange={(event, newValue) => {
              if (newValue) {
                handleAddService(newValue);
                inputRef && inputRef.blur();
              }
            }}
            onBlur={() => setSearchTerm('')}
            renderInput={params => (
              <ServicesTextField
                {...params}
                label="Пошук послуг..."
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                inputRef={ref => setInputRef(ref)}
              />
            )}
          />
        </AddServices>
      </Header>

      {services && (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableNameHeader>Назва</TableNameHeader>
                <TableHeader>Кількість</TableHeader>
                <TableHeader>Вартість</TableHeader>
                <TableHeader>Сума</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {services.map(service => (
                <TableRow key={service._id}>
                  <TableData>{service.name}</TableData>
                  <TableData>
                    {service.pricePerMeter ? (
                      <AmountInput
                        type="number"
                        defaultValue={service.amount || 1}
                        min="1"
                        onChange={e =>
                          handleChangeAmount(service._id, e.target.value)
                        }
                      />
                    ) : (
                      1
                    )}
                  </TableData>

                  <TableData>{service.price}</TableData>
                  <TableData>{service.price * (service.amount || 1)}</TableData>
                  <TableData>
                    <DeleteBtn
                      type="button"
                      title="Видалити послугу"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      <DeleteIcon />
                    </DeleteBtn>
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </ServicesContainer>
  );
};
