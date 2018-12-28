import { IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';


export default class SPUtils {
    public static DayPickerStrings: IDatePickerStrings = {
        months: [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
        ],
    
        shortMonths: [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez'
        ],
    
        days: [
            'Domingo',
            'Segunda',
            'Terça',
            'Quarta',
            'Quinta',
            'Sexta',
            'Sábado'
        ],
        shortDays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        goToToday: 'Ir para hoje',
        prevMonthAriaLabel: 'Ir para mês anterior',
        nextMonthAriaLabel: 'Ir para próx. mês',
        prevYearAriaLabel: 'Ir para ano anterior',
        nextYearAriaLabel: 'Ir para próx. ano',
        isRequiredErrorMessage: 'Campo obrigatório',
        invalidInputErrorMessage: 'Formato de data inválido'
    };

    public static parseTime = (time) => {
        console.log(time)
        return time.hour()+":"+time.minute()
	}
}
