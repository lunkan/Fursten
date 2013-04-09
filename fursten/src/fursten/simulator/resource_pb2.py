# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: resource.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)




DESCRIPTOR = _descriptor.FileDescriptor(
  name='resource.proto',
  package='messages',
  serialized_pb='\n\x0eresource.proto\x12\x08messages\"\x90\x02\n\x08Resource\x12\x0b\n\x03key\x18\x01 \x02(\x11\x12\x0c\n\x04name\x18\x02 \x02(\t\x12\x11\n\tthreshold\x18\x03 \x01(\x02\x12)\n\x06weight\x18\x04 \x03(\x0b\x32\x19.messages.Resource.Weight\x12/\n\toffspring\x18\x05 \x03(\x0b\x32\x1c.messages.Resource.Offspring\x1a\x42\n\x06Weight\x12\x1a\n\x12resource_reference\x18\x01 \x02(\x11\x12\r\n\x05group\x18\x02 \x02(\x05\x12\r\n\x05value\x18\x03 \x02(\x02\x1a\x36\n\tOffspring\x12\x1a\n\x12resource_reference\x18\x01 \x02(\x11\x12\r\n\x05value\x18\x02 \x02(\x02\";\n\x12ResourceCollection\x12%\n\tresources\x18\x01 \x03(\x0b\x32\x12.messages.ResourceB*\n\x19org.fursten.message.protoB\rResourceProto')




_RESOURCE_WEIGHT = _descriptor.Descriptor(
  name='Weight',
  full_name='messages.Resource.Weight',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='resource_reference', full_name='messages.Resource.Weight.resource_reference', index=0,
      number=1, type=17, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='group', full_name='messages.Resource.Weight.group', index=1,
      number=2, type=5, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='value', full_name='messages.Resource.Weight.value', index=2,
      number=3, type=2, cpp_type=6, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=179,
  serialized_end=245,
)

_RESOURCE_OFFSPRING = _descriptor.Descriptor(
  name='Offspring',
  full_name='messages.Resource.Offspring',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='resource_reference', full_name='messages.Resource.Offspring.resource_reference', index=0,
      number=1, type=17, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='value', full_name='messages.Resource.Offspring.value', index=1,
      number=2, type=2, cpp_type=6, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=247,
  serialized_end=301,
)

_RESOURCE = _descriptor.Descriptor(
  name='Resource',
  full_name='messages.Resource',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='key', full_name='messages.Resource.key', index=0,
      number=1, type=17, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='name', full_name='messages.Resource.name', index=1,
      number=2, type=9, cpp_type=9, label=2,
      has_default_value=False, default_value=unicode("", "utf-8"),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='threshold', full_name='messages.Resource.threshold', index=2,
      number=3, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='weight', full_name='messages.Resource.weight', index=3,
      number=4, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='offspring', full_name='messages.Resource.offspring', index=4,
      number=5, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[_RESOURCE_WEIGHT, _RESOURCE_OFFSPRING, ],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=29,
  serialized_end=301,
)


_RESOURCECOLLECTION = _descriptor.Descriptor(
  name='ResourceCollection',
  full_name='messages.ResourceCollection',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='resources', full_name='messages.ResourceCollection.resources', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  extension_ranges=[],
  serialized_start=303,
  serialized_end=362,
)

_RESOURCE_WEIGHT.containing_type = _RESOURCE;
_RESOURCE_OFFSPRING.containing_type = _RESOURCE;
_RESOURCE.fields_by_name['weight'].message_type = _RESOURCE_WEIGHT
_RESOURCE.fields_by_name['offspring'].message_type = _RESOURCE_OFFSPRING
_RESOURCECOLLECTION.fields_by_name['resources'].message_type = _RESOURCE
DESCRIPTOR.message_types_by_name['Resource'] = _RESOURCE
DESCRIPTOR.message_types_by_name['ResourceCollection'] = _RESOURCECOLLECTION

class Resource(_message.Message):
  __metaclass__ = _reflection.GeneratedProtocolMessageType

  class Weight(_message.Message):
    __metaclass__ = _reflection.GeneratedProtocolMessageType
    DESCRIPTOR = _RESOURCE_WEIGHT

    # @@protoc_insertion_point(class_scope:messages.Resource.Weight)

  class Offspring(_message.Message):
    __metaclass__ = _reflection.GeneratedProtocolMessageType
    DESCRIPTOR = _RESOURCE_OFFSPRING

    # @@protoc_insertion_point(class_scope:messages.Resource.Offspring)
  DESCRIPTOR = _RESOURCE

  # @@protoc_insertion_point(class_scope:messages.Resource)

class ResourceCollection(_message.Message):
  __metaclass__ = _reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _RESOURCECOLLECTION

  # @@protoc_insertion_point(class_scope:messages.ResourceCollection)


DESCRIPTOR.has_options = True
DESCRIPTOR._options = _descriptor._ParseOptions(descriptor_pb2.FileOptions(), '\n\031org.fursten.message.protoB\rResourceProto')
# @@protoc_insertion_point(module_scope)
