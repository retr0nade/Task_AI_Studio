class DomainError(Exception):
    pass

class InvalidTransitionError(DomainError):
    pass

class MissingAcceptanceCriteriaError(DomainError):
    pass
