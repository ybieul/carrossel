# TymerBook - Sistema Completo de Gestão para Negócios de Beleza e Serviços

TymerBook é uma plataforma SaaS multi-tenant de gestão completa para salões, barbearias, clínicas de estética e outros negócios de serviços. O sistema integra agendamento online, gestão de clientes, automação de marketing, controle financeiro e muito mais em uma solução única e moderna.

## O Que é TymerBook

Sistema web de gestão empresarial focado em negócios de serviços que oferece agendamento online, automação de comunicação, controle financeiro, gestão de equipe e ferramentas de fidelização. A plataforma elimina a dependência de papel, planilhas e múltiplos aplicativos, centralizando toda operação em um único lugar acessível de qualquer dispositivo.

## Proposta de Valor

- **Economia de Tempo**: Redução de até 70% no tempo gasto com agendamentos e confirmações via automação.
- **Redução de Faltas**: Sistema de lembretes automáticos diminui no-shows em até 60%.
- **Aumento de Receita**: Ferramentas de fidelização e remarketing aumentam ticket médio e retenção.
- **Profissionalização**: Presença digital completa com página de agendamento personalizada.
- **Controle Total**: Visão 360° do negócio com relatórios, métricas e análises em tempo real.
- **Sem Investimento Inicial**: Modelo SaaS com mensalidade acessível, sem necessidade de servidor próprio.

## Arquitetura e Tecnologia

### Stack Tecnológico
- **Frontend**: Next.js 14 com App Router, React 18, TypeScript, Tailwind CSS.
- **Backend**: API Routes do Next.js com autenticação JWT e cookies seguros.
- **Banco de Dados**: MySQL com Prisma ORM (suporte a PostgreSQL também).
- **Integrações**: WhatsApp Business API, Evolution API para automações.
- **Hospedagem**: Docker, Easypanel, VPS (Hostinger/outros provedores).
- **Pagamentos**: Integração preparada para gateways brasileiros.

### Modelo Multi-Tenant
- Cada estabelecimento opera de forma isolada e independente.
- Banco de dados compartilhado com segregação lógica por `establishmentId`.
- Escalabilidade horizontal com suporte a milhares de estabelecimentos simultâneos.
- Segurança de dados com isolamento total entre tenants.

## Funcionalidades Principais

### 1. Sistema de Autenticação e Perfis

#### Tipos de Usuário
- **Administrador**: Controle total do estabelecimento, configurações, relatórios.
- **Profissional**: Gerencia agenda própria, atendimentos, comissões.
- **Cliente**: Realiza agendamentos, visualiza histórico, acessa programa de fidelidade.

#### Recursos de Autenticação
- Login seguro com JWT e cookies httpOnly.
- Recuperação de senha via email com token temporário.
- Registro de estabelecimentos com validação de dados.
- Proteção de rotas por tipo de usuário.
- Sessões persistentes com renovação automática.

### 2. Agendamento Online Completo

#### Página de Agendamento Pública
- URL personalizada: `tymerbook.com/agendamento/[slug-estabelecimento]`.
- Interface responsiva e intuitiva para clientes.
- Seleção de profissional, serviço, data e horário.
- Visualização em tempo real de horários disponíveis.
- Confirmação instantânea via WhatsApp.

#### Gestão de Agenda Profissional
- Calendário visual com drag-and-drop.
- Visualização diária, semanal e mensal.
- Bloqueio de horários para folgas, almoço ou compromissos pessoais.
- Exceções de horário para feriados ou eventos especiais.
- Configuração individual de horários de trabalho por profissional.
- Intervalos entre atendimentos configuráveis.

#### Controle de Disponibilidade
- Horários fixos por dia da semana.
- Duração específica para cada serviço.
- Sobreposição inteligente (evita dupla marcação).
- Margem de segurança entre atendimentos.
- Bloqueio automático de horários passados.

### 3. Gestão de Serviços

#### Cadastro de Serviços
- Nome, descrição detalhada e categoria.
- Preço e duração em minutos.
- Upload de imagem representativa.
- Comissão fixa ou percentual para profissionais.
- Status ativo/inativo para controle de catálogo.

#### Organização
- Categorização por tipo (corte, barba, coloração, etc.).
- Vinculação de serviços a profissionais específicos.
- Preços diferenciados por profissional (opcional).
- Pacotes e combos (roadmap).

### 4. Gestão de Clientes

#### Cadastro Completo
- Dados pessoais: nome, telefone, email, CPF.
- Histórico completo de atendimentos.
- Notas e observações privadas.
- Data de aniversário para ações de marketing.
- Status de fidelidade e pontos acumulados.

#### Funcionalidades
- Busca rápida por nome ou telefone.
- Filtros por período de último atendimento.
- Exportação de lista para campanhas.
- Integração com WhatsApp para contato direto.
- Estatísticas de frequência e ticket médio.

### 5. Automações de WhatsApp

#### Lembretes Automáticos
- Confirmação de agendamento instantânea.
- Lembrete 24h antes com opção de cancelamento.
- Lembrete 1h antes do horário.
- Mensagens personalizáveis com variáveis dinâmicas.
- Disparo automático via Evolution API.

#### Campanhas e Remarketing
- Mensagem de aniversário automática com desconto.
- Recuperação de clientes inativos (30, 60, 90 dias).
- Promoções sazonais programadas.
- Agradecimento pós-atendimento.
- Taxa de abertura e resposta trackada.

#### Configuração
- Conexão via QR Code com WhatsApp Business.
- Templates de mensagens editáveis.
- Variáveis: `{nome}`, `{data}`, `{horario}`, `{profissional}`, `{servico}`.
- Horário de envio configurável (respeita horário comercial).
- Histórico de mensagens enviadas.

### 6. Programa de Fidelidade

#### Sistema de Pontos
- Pontuação por agendamento (1 ponto por atendimento).
- Metas configuráveis: 10 pontos = 1 serviço grátis (ajustável).
- Acompanhamento visual do progresso para o cliente.
- Notificação automática ao atingir meta.
- Resgate direto na próxima reserva.

#### Benefícios para o Negócio
- Aumento de 35% na retenção de clientes.
- Incentivo a retornos frequentes.
- Diferencial competitivo.
- Dados de comportamento para análise.

### 7. Controle Financeiro

#### Gestão de Atendimentos
- Status: agendado, confirmado, concluído, cancelado.
- Forma de pagamento: dinheiro, PIX, cartão débito/crédito.
- Valor cobrado (pode diferir do valor padrão).
- Comissões calculadas automaticamente.
- Histórico de transações por período.

#### Relatórios Financeiros
- Faturamento diário, semanal, mensal.
- Receita por profissional.
- Receita por serviço.
- Comissões a pagar.
- Ticket médio.
- Taxa de ocupação da agenda.

#### Controle de Despesas
- Cadastro de despesas fixas (aluguel, luz, água).
- Despesas variáveis (produtos, manutenção).
- Categorização de gastos.
- Fluxo de caixa: entradas menos saídas.
- Lucro líquido por período.

### 8. Gestão de Profissionais

#### Cadastro de Equipe
- Dados: nome, email, telefone, foto de perfil.
- Especialidades e serviços oferecidos.
- Percentual ou valor fixo de comissão.
- Horários de trabalho individualizados.
- Status ativo/inativo.

#### Controle Individual
- Agenda exclusiva por profissional.
- Relatório de produtividade.
- Total de atendimentos e receita gerada.
- Comissões calculadas automaticamente.
- Feedback de clientes (roadmap).

### 9. Painel Administrativo (Dashboard)

#### Métricas em Tempo Real
- Agendamentos de hoje.
- Faturamento do dia/mês.
- Novos clientes cadastrados.
- Taxa de ocupação da agenda.
- Comparativo com período anterior.

#### Gráficos e Análises
- Evolução de faturamento (linha temporal).
- Serviços mais vendidos (gráfico de barras).
- Horários de pico.
- Distribuição por forma de pagamento.
- Clientes mais frequentes.

#### Ações Rápidas
- Criar novo agendamento manual.
- Cadastrar cliente rapidamente.
- Bloquear horário na agenda.
- Enviar mensagem via WhatsApp.
- Visualizar próximos atendimentos.

### 10. Configurações do Estabelecimento

#### Dados do Negócio
- Nome fantasia e razão social.
- CNPJ/CPF, telefone, email.
- Endereço completo.
- Logo e imagens do estabelecimento.
- Slug personalizado para URL de agendamento.

#### Configurações Operacionais
- Horário de funcionamento padrão.
- Intervalo padrão entre atendimentos.
- Tempo de antecedência mínima para agendamento.
- Tempo máximo de antecedência.
- Política de cancelamento.
- Texto de boas-vindas para clientes.

#### Integrações
- WhatsApp Business via Evolution API.
- Configuração de instância e token.
- Webhook para recebimento de respostas.
- Google Calendar (roadmap).
- Sistemas de pagamento (roadmap).

### 11. Páginas Públicas

#### Landing Page
- Apresentação da plataforma.
- Benefícios e funcionalidades.
- Depoimentos de clientes.
- Planos e preços.
- Formulário de cadastro.
- Design moderno e responsivo.

#### Página de Agendamento
- Interface clean e profissional.
- Logo e cores do estabelecimento.
- Fotos de serviços.
- Informações de contato e localização.
- Botão de WhatsApp direto.
- Sistema de agendamento em 4 passos.

#### Página do Profissional
- Perfil público com foto e especialidades.
- Serviços oferecidos com preços.
- Avaliações (roadmap).
- Link direto para agendar com o profissional.

### 12. Sistema de Notificações

#### Notificações In-App
- Alertas de novos agendamentos.
- Confirmação de cancelamentos.
- Avisos de falhas em automações.
- Lembretes de aniversariantes do dia.
- Alertas de clientes inativos.

#### Notificações por WhatsApp
- Para profissionais: novo agendamento, cancelamento.
- Para clientes: confirmação, lembretes, promoções.
- Para administradores: resumo diário, alertas importantes.

#### Notificações por Email
- Confirmação de cadastro.
- Recuperação de senha.
- Relatórios semanais/mensais.
- Alertas de pagamento de assinatura.

## Planos e Modelos de Negócio

### Plano Gratuito (Free)
- 1 profissional.
- 50 agendamentos/mês.
- Funcionalidades básicas de agenda.
- Limite de 100 clientes.
- Sem automações de WhatsApp.

### Plano Básico
- Até 3 profissionais.
- Agendamentos ilimitados.
- 500 clientes.
- Automações básicas (confirmação e lembrete).
- Programa de fidelidade.
- Relatórios básicos.

### Plano Premium
- Profissionais ilimitados.
- Clientes ilimitados.
- Todas as automações.
- Relatórios avançados.
- Campanhas de remarketing.
- Suporte prioritário.
- Integração com sistemas de pagamento.
- Remoção de marca TymerBook (whitelabel).

### Plano Enterprise
- Todos os recursos Premium.
- Múltiplas unidades/franquias.
- API para integrações customizadas.
- Treinamento personalizado.
- Gerente de conta dedicado.

## Diferenciais Competitivos

### Tecnologia de Ponta
- Interface moderna e intuitiva.
- Velocidade de carregamento otimizada.
- Responsivo em todos os dispositivos.
- Atualizações constantes.

### Automação Inteligente
- Economia de 10+ horas semanais em tarefas manuais.
- Redução drástica de no-shows.
- Comunicação proativa com clientes.
- Marketing automático e personalizado.

### Foco no Mercado Brasileiro
- Interface em português.
- Integração com WhatsApp (canal preferido no Brasil).
- Suporte a métodos de pagamento locais.
- Horário comercial brasileiro.
- Suporte em português.

### Facilidade de Uso
- Onboarding guiado passo a passo.
- Configuração inicial em menos de 15 minutos.
- Tutoriais em vídeo.
- Interface sem complexidade técnica.
- Suporte via WhatsApp.

### Segurança e Confiabilidade
- Dados criptografados.
- Backup automático diário.
- Conformidade com LGPD.
- Uptime de 99,9%.
- Servidores no Brasil.

## Fluxos de Trabalho Principais

### Fluxo de Agendamento pelo Cliente
1. Cliente acessa URL personalizada do estabelecimento.
2. Seleciona profissional desejado (ou "primeiro disponível").
3. Escolhe o serviço no catálogo.
4. Visualiza calendário com horários livres.
5. Seleciona data e horário.
6. Preenche dados pessoais (nome, telefone).
7. Confirma agendamento.
8. Recebe confirmação automática via WhatsApp.
9. Recebe lembrete 24h antes.
10. Recebe lembrete 1h antes.

### Fluxo de Gestão pelo Profissional
1. Profissional faz login no sistema.
2. Visualiza agenda do dia no dashboard.
3. Recebe notificação de novo agendamento.
4. Prepara-se para atendimento conforme horário.
5. Marca atendimento como "concluído" após finalizar.
6. Registra forma de pagamento.
7. Sistema calcula comissão automaticamente.
8. Cliente recebe mensagem de agradecimento.
9. Pontos de fidelidade são creditados ao cliente.

### Fluxo de Gestão pelo Administrador
1. Acessa dashboard com visão geral do negócio.
2. Monitora agendamentos e faturamento.
3. Cadastra novos serviços ou ajusta preços.
4. Gerencia equipe e comissões.
5. Configura automações de WhatsApp.
6. Cria campanhas de remarketing.
7. Analisa relatórios de desempenho.
8. Exporta dados para contabilidade.
9. Ajusta configurações conforme necessário.

## Automações Detalhadas

### 1. Automação de Confirmação
- **Disparo**: Imediatamente após agendamento.
- **Conteúdo**: "Olá {nome}! Seu agendamento está confirmado para {data} às {horario} com {profissional}. Serviço: {servico}. Aguardamos você!"
- **Objetivo**: Tranquilizar cliente e reduzir dúvidas.

### 2. Automação de Lembrete 24h
- **Disparo**: 24 horas antes do horário agendado.
- **Conteúdo**: "Oi {nome}! Lembrando que você tem agendamento amanhã às {horario} com {profissional}. Confirme sua presença ou cancele se necessário."
- **Objetivo**: Reduzir faltas e permitir remanejamento.

### 3. Automação de Lembrete 1h
- **Disparo**: 1 hora antes do horário agendado.
- **Conteúdo**: "Olá {nome}! Seu horário com {profissional} é daqui a 1 hora. Estamos te esperando!"
- **Objetivo**: Lembrete final para evitar atrasos.

### 4. Automação de Aniversário
- **Disparo**: No dia do aniversário do cliente, às 9h.
- **Conteúdo**: "Parabéns {nome}! 🎉 Para comemorar, oferecemos 20% de desconto no seu próximo atendimento. Agende já!"
- **Objetivo**: Fidelização e aumento de receita.

### 5. Automação de Clientes Inativos
- **Disparo**: 30, 60 ou 90 dias após último atendimento.
- **Conteúdo**: "Oi {nome}! Sentimos sua falta! Que tal agendar um horário? Temos novidades esperando por você!"
- **Objetivo**: Reativar clientes e recuperar receita.

### 6. Automação de Agradecimento
- **Disparo**: 2 horas após conclusão do atendimento.
- **Conteúdo**: "Obrigado pela preferência, {nome}! Foi um prazer atendê-lo. Avalie nossa experiência e ganhe pontos extras de fidelidade!"
- **Objetivo**: Feedback e engajamento contínuo.

## Métricas e Indicadores

### KPIs Principais
- **Taxa de Ocupação**: Horários agendados / horários disponíveis × 100.
- **Taxa de Conversão**: Agendamentos confirmados / visitas na página.
- **No-Show Rate**: Faltas / total de agendamentos × 100.
- **Ticket Médio**: Receita total / número de atendimentos.
- **CAC (Custo de Aquisição)**: Investimento em marketing / novos clientes.
- **LTV (Lifetime Value)**: Ticket médio × frequência anual × anos de retenção.
- **Churn Rate**: Clientes perdidos / total de clientes × 100.

### Relatórios Disponíveis
- Faturamento diário, semanal, mensal, anual.
- Comparativo entre períodos (MoM, YoY).
- Performance por profissional.
- Serviços mais e menos vendidos.
- Horários de maior demanda.
- Clientes mais frequentes e valiosos.
- Efetividade de campanhas de marketing.
- Taxa de resgate de fidelidade.

## Segurança e Conformidade

### Proteção de Dados (LGPD)
- Criptografia de dados sensíveis.
- Consentimento explícito para comunicações.
- Direito ao esquecimento (exclusão de dados).
- Portabilidade de dados.
- Termos de uso e política de privacidade.

### Segurança Técnica
- Autenticação JWT com tokens de curta duração.
- Cookies httpOnly e secure.
- Proteção contra CSRF e XSS.
- Rate limiting em APIs.
- Validação de inputs no backend.
- Logs de auditoria de ações sensíveis.

### Backup e Recuperação
- Backup automático diário do banco de dados.
- Retenção de 30 dias de backups.
- Recuperação point-in-time.
- Redundância de servidores.

## Roadmap de Funcionalidades

### Curto Prazo (3 meses)
- Integração com Google Calendar.
- App mobile nativo (iOS e Android).
- Pagamento online na reserva.
- Sistema de avaliações e reviews.
- Chat interno entre profissional e cliente.

### Médio Prazo (6 meses)
- Gestão de estoque de produtos.
- Venda de produtos no PDV.
- Comanda eletrônica.
- Integração com contabilidade.
- Relatórios fiscais automatizados.

### Longo Prazo (12 meses)
- Inteligência artificial para recomendação de horários.
- Previsão de demanda.
- Precificação dinâmica.
- Marketplace de profissionais.
- Programa de afiliados.
- Whitelabel completo para revendas.

## Casos de Uso Reais

### Barbearia Tradicional
- 3 profissionais, 150 atendimentos/semana.
- Redução de 80% em faltas após implementação.
- Aumento de 40% em agendamentos por acesso facilitado.
- Economia de 15h/semana em gestão de agenda.

### Salão de Beleza Médio Porte
- 8 profissionais, 400 atendimentos/semana.
- Fidelização de 65% dos clientes via programa de pontos.
- Aumento de 25% no ticket médio com campanhas automatizadas.
- Controle financeiro preciso com relatórios detalhados.

### Clínica de Estética
- 5 especialistas, 200 atendimentos/semana.
- Profissionalização da imagem com página personalizada.
- Recuperação de 30% de clientes inativos via automação.
- Gestão integrada de múltiplos tipos de serviços.

## Suporte e Treinamento

### Onboarding
- Tutorial interativo no primeiro acesso.
- Vídeos explicativos de cada funcionalidade.
- Central de ajuda com artigos detalhados.
- Configuração assistida via WhatsApp.

### Suporte Contínuo
- Chat de suporte via WhatsApp (horário comercial).
- Base de conhecimento com perguntas frequentes.
- Email de suporte técnico.
- Comunidade de usuários (roadmap).

### Treinamento
- Webinars mensais sobre funcionalidades.
- Certificação de uso avançado (roadmap).
- Consultoria de melhores práticas.
- Material educativo sobre gestão de negócios.

## Benefícios Quantificáveis

### Para o Estabelecimento
- **+45%** em novos agendamentos via presença online.
- **-60%** em taxa de no-shows com lembretes automáticos.
- **+35%** em retenção de clientes com programa de fidelidade.
- **+25%** em ticket médio com remarketing direcionado.
- **-70%** em tempo gasto com gestão de agenda.
- **+90%** em satisfação de clientes pela facilidade de agendamento.

### Para os Profissionais
- Agenda organizada e otimizada.
- Menos tempo com tarefas administrativas.
- Maior previsibilidade de receita.
- Comissões calculadas automaticamente.
- Acesso mobile à agenda.

### Para os Clientes
- Agendamento 24/7 sem precisar ligar.
- Lembretes para não esquecer horários.
- Programa de recompensas por fidelidade.
- Histórico completo de atendimentos.
- Comunicação direta via WhatsApp.

## Integração e APIs

### APIs Integradas
- **Evolution API**: Automação de WhatsApp.
- **Prisma ORM**: Camada de acesso ao banco de dados.
- **NextAuth (preparado)**: Sistema de autenticação extensível.

### Webhooks Disponíveis
- Novo agendamento criado.
- Agendamento cancelado.
- Atendimento concluído.
- Cliente novo cadastrado.
- Meta de fidelidade atingida.

### Possibilidades de Integração
- Sistemas de pagamento (Mercado Pago, Stripe, PagSeguro).
- Google Calendar e calendários externos.
- Sistemas de contabilidade.
- Plataformas de email marketing.
- ERPs e sistemas de gestão.

## Escalabilidade e Performance

### Capacidade
- Suporte a milhares de estabelecimentos simultâneos.
- Milhões de agendamentos processados.
- Centenas de milhares de automações disparadas/dia.
- Resposta de API < 200ms em média.

### Otimizações
- Cache de queries frequentes.
- Índices otimizados no banco de dados.
- Lazy loading de componentes.
- Compressão de assets.
- CDN para conteúdo estático.
- Code splitting para redução de bundle.

## Conclusão

TymerBook é uma solução completa, moderna e escalável que digitaliza e otimiza a gestão de negócios de serviços. Com foco em automação, experiência do usuário e resultados mensuráveis, a plataforma se posiciona como ferramenta essencial para estabelecimentos que buscam profissionalização, crescimento e eficiência operacional.

A combinação de agendamento online intuitivo, automações inteligentes via WhatsApp, programa de fidelidade, controle financeiro robusto e relatórios detalhados proporciona aos negócios as ferramentas necessárias para competir no mercado digital, reduzir custos operacionais e aumentar receita de forma sustentável.

Com arquitetura moderna baseada em Next.js e TypeScript, modelo SaaS escalável e roadmap ambicioso de novas funcionalidades, TymerBook está posicionada para se tornar referência no segmento de gestão para o mercado de beleza e serviços no Brasil.